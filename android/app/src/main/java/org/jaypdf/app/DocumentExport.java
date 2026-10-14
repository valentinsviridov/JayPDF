package org.jaypdf.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.provider.DocumentsContract;
import android.util.Base64;
import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.webkit.JavaScriptReplyProxy;
import androidx.webkit.WebViewFeature;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.json.JSONObject;

/** Bounded chunks go to private cache, then to the single destination explicitly chosen by the user. */
final class DocumentExport {
    private static final long MAX_BYTES = 512L * 1024 * 1024;
    private static final Set<String> MIME_TYPES = new java.util.HashSet<>(java.util.Arrays.asList("application/pdf", "application/zip", "image/png", "image/jpeg", "application/octet-stream"));
    private final ComponentActivity activity;
    private final File directory;
    private final ExecutorService io = Executors.newSingleThreadExecutor();
    private final Handler main = new Handler(Looper.getMainLooper());
    private final ActivityResultLauncher<Intent> picker;
    private Session session;
    private boolean destroyed;
    private final Runnable expire = () -> reset();

    private static final class Session {
        String token, fileName, mime, finishId;
        long expected, written;
        File file;
        OutputStream stream;
        JavaScriptReplyProxy finishReply;
        boolean choosing;
    }

    DocumentExport(ComponentActivity activity) {
        this.activity = activity;
        directory = new File(activity.getCacheDir(), "exports");
        directory.mkdirs();
        // Clear leftovers after a force-stop or process death, without storing document names.
        File[] leftovers = directory.listFiles();
        if (leftovers != null) for (File file : leftovers) file.delete();
        picker = activity.registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
            Session current = session;
            if (current == null || !current.choosing) return;
            Uri destination = result.getData() == null ? null : result.getData().getData();
            if (result.getResultCode() != ComponentActivity.RESULT_OK || destination == null) {
                reply(current.finishReply, current.finishId, null, true);
                reset();
                return;
            }
            io.execute(() -> {
                String failure = null;
                try (FileInputStream input = new FileInputStream(current.file);
                     OutputStream output = activity.getContentResolver().openOutputStream(destination, "wt")) {
                    if (output == null) throw new IllegalStateException();
                    byte[] buffer = new byte[64 * 1024];
                    int count;
                    while ((count = input.read(buffer)) != -1) output.write(buffer, 0, count);
                    output.flush();
                } catch (Exception error) {
                    failure = "Could not save the file. Check available storage and try again.";
                    try { DocumentsContract.deleteDocument(activity.getContentResolver(), destination); } catch (Exception ignored) { }
                }
                String message = failure;
                main.post(() -> {
                    if (session == current && !destroyed) {
                        reply(current.finishReply, current.finishId, message, false);
                        reset();
                    }
                });
            });
        });
    }

    void receive(String raw, JavaScriptReplyProxy proxy) {
        String id = "";
        try {
            if (raw == null || raw.length() > 270_000) throw new IllegalArgumentException();
            JSONObject data = new JSONObject(raw);
            id = data.getString("id");
            String token = data.getString("session");
            String action = data.getString("action");
            if (id.length() > 120 || token.length() > 80 || destroyed) throw new IllegalArgumentException();
            if (action.equals("abort")) {
                if (session != null && session.token.equals(token) && !session.choosing) reset();
                return;
            }
            if (action.equals("begin")) {
                if (session != null) {
                    reply(proxy, id, "Another file is being saved. Finish that save first.", false);
                    return;
                }
                Session next = new Session();
                next.token = token;
                next.expected = data.getLong("size");
                if (next.expected < 0 || next.expected > MAX_BYTES) throw new IllegalArgumentException();
                next.fileName = data.getString("fileName").replaceAll("[\\\\/\\p{Cntrl}]", "_");
                if (next.fileName.trim().isEmpty() || next.fileName.length() > 240) next.fileName = "jaypdf_result";
                next.mime = data.getString("mimeType");
                if (!MIME_TYPES.contains(next.mime)) next.mime = "application/octet-stream";
                next.file = File.createTempFile("export-", ".tmp", directory);
                session = next;
                next.stream = new FileOutputStream(next.file);
                scheduleExpiry();
                reply(proxy, id, null, false);
                return;
            }
            Session current = session;
            if (current == null || !current.token.equals(token) || current.choosing) throw new IllegalArgumentException();
            String requestId = id;
            if (action.equals("chunk")) {
                byte[] bytes = Base64.decode(data.getString("data"), Base64.NO_WRAP);
                if (bytes.length > 192 * 1024 || current.written + bytes.length > current.expected) throw new IllegalArgumentException();
                current.written += bytes.length;
                scheduleExpiry();
                io.execute(() -> {
                    try {
                        current.stream.write(bytes);
                        main.post(() -> { if (session == current) reply(proxy, requestId, null, false); });
                    } catch (Exception failure) {
                        main.post(() -> {
                            if (session == current) {
                                reply(proxy, requestId, "Could not prepare the file. Check available storage.", false);
                                reset();
                            }
                        });
                    }
                });
            } else if (action.equals("finish")) {
                if (current.written != current.expected) throw new IllegalArgumentException();
                current.choosing = true;
                current.finishId = id;
                current.finishReply = proxy;
                main.removeCallbacks(expire);
                io.execute(() -> {
                    try {
                        current.stream.close();
                        main.post(() -> {
                            if (session != current || destroyed) return;
                            Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT)
                                    .addCategory(Intent.CATEGORY_OPENABLE).setType(current.mime)
                                    .putExtra(Intent.EXTRA_TITLE, current.fileName);
                            try { picker.launch(intent); }
                            catch (Exception failure) {
                                reply(proxy, requestId, "The Android save picker is unavailable.", false);
                                reset();
                            }
                        });
                    } catch (Exception failure) {
                        main.post(() -> {
                            if (session == current) {
                                reply(proxy, requestId, "Could not prepare the file for saving.", false);
                                reset();
                            }
                        });
                    }
                });
            } else throw new IllegalArgumentException();
        } catch (Exception invalid) {
            reply(proxy, id, "Invalid save request. Please try again.", false);
            if (session != null && !session.choosing) reset();
        }
    }

    private void scheduleExpiry() {
        main.removeCallbacks(expire);
        main.postDelayed(expire, 120_000);
    }

    private void reply(JavaScriptReplyProxy proxy, String id, String error, boolean cancelled) {
        if (destroyed) return;
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) return;
        try {
            JSONObject data = new JSONObject().put("id", id).put("cancelled", cancelled);
            if (error != null) data.put("error", error);
            proxy.postMessage(data.toString());
        } catch (Exception ignored) { /* The page may have been closed. */ }
    }

    void reset() {
        main.removeCallbacks(expire);
        Session previous = session;
        session = null;
        if (previous != null) io.execute(() -> {
            try { if (previous.stream != null) previous.stream.close(); } catch (Exception ignored) { }
            if (previous.file != null) previous.file.delete();
        });
    }

    void destroy() {
        destroyed = true;
        reset();
        io.shutdown();
    }
}
