package org.jaypdf.app;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.webkit.ServiceWorkerClientCompat;
import androidx.webkit.ServiceWorkerControllerCompat;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import java.util.ArrayList;
import java.util.Set;

public final class MainActivity extends ComponentActivity {
    private WebView webView;
    private DocumentExport exports;
    private ValueCallback<Uri[]> fileCallback;
    private final ActivityResultLauncher<Intent> openFiles = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(), result -> {
                if (fileCallback == null) return;
                ArrayList<Uri> uris = new ArrayList<>();
                Intent data = result.getData();
                if (result.getResultCode() == RESULT_OK && data != null) {
                    if (data.getClipData() != null) {
                        for (int index = 0; index < data.getClipData().getItemCount(); index++) {
                            uris.add(data.getClipData().getItemAt(index).getUri());
                        }
                    } else if (data.getData() != null) uris.add(data.getData());
                }
                // Never expose file:// or arbitrary URI schemes returned by a third-party picker.
                uris.removeIf(uri -> !"content".equals(uri.getScheme()));
                fileCallback.onReceiveValue(uris.isEmpty() ? null : uris.toArray(new Uri[0]));
                fileCallback = null;
            });

    @Override
    @SuppressLint({"SetJavaScriptEnabled", "RequiresFeature"}) // Only bundled JS; WEB_MESSAGE_LISTENER checked before setup.
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        exports = new DocumentExport(this);
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            TextView message = new TextView(this);
            message.setText(R.string.webview_update);
            message.setPadding(32, 64, 32, 32);
            setContentView(message);
            return;
        }
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        FrameLayout container = new FrameLayout(this);
        ViewCompat.setOnApplyWindowInsetsListener(container, (view, insets) -> {
            Insets safe = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout() | WindowInsetsCompat.Type.ime());
            view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
            return insets;
        });
        webView = new WebView(this);
        webView.setId(android.R.id.primary);
        container.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(container);
        WindowCompat.getInsetsController(getWindow(), container).setAppearanceLightNavigationBars(true);
        ViewCompat.requestApplyInsets(container);

        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true); // Only document URIs granted by the system picker.
        settings.setBlockNetworkLoads(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        CookieManager.getInstance().setAcceptCookie(false);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false);

        BundledContent content = new BundledContent(getAssets());
        if (WebViewFeature.isFeatureSupported(WebViewFeature.SERVICE_WORKER_BASIC_USAGE)) {
            ServiceWorkerControllerCompat.getInstance().setServiceWorkerClient(new ServiceWorkerClientCompat() {
                @Override public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
                    return content.respond(request.getUrl());
                }
            });
        }
        WebViewCompat.addWebMessageListener(webView, "JayPdfDocuments", java.util.Collections.singleton(BundledContent.ORIGIN),
                (view, message, origin, mainFrame, proxy) -> {
                    if (mainFrame && BundledContent.isLocal(origin)) exports.receive(message.getData(), proxy);
                });
        webView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return content.respond(request.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (BundledContent.isLocal(uri)) return false;
                if (request.isForMainFrame() && request.hasGesture()
                        && new java.util.HashSet<>(java.util.Arrays.asList("https", "mailto")).contains(uri.getScheme())) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE)); }
                    catch (ActivityNotFoundException missing) { Toast.makeText(MainActivity.this, R.string.no_handler, Toast.LENGTH_LONG).show(); }
                }
                return true;
            }
            @Override public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                exports.reset();
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE)
                        .setType("*/*").putExtra(Intent.EXTRA_ALLOW_MULTIPLE, params.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE)
                        .putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/pdf", "image/png", "image/jpeg", "image/webp"})
                        .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                try { openFiles.launch(intent); }
                catch (ActivityNotFoundException missing) {
                    fileCallback.onReceiveValue(null);
                    fileCallback = null;
                    Toast.makeText(MainActivity.this, R.string.picker_unavailable, Toast.LENGTH_LONG).show();
                }
                return true;
            }
        });
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack();
                else new AlertDialog.Builder(MainActivity.this).setTitle(R.string.leave_title).setMessage(R.string.leave_message)
                        .setNegativeButton(R.string.stay, null).setPositiveButton(R.string.close, (dialog, button) -> finish()).show();
            }
        });
        // Never restore documents or WebView state across process death.
        webView.loadUrl(BundledContent.ORIGIN + "/");
    }

    @Override protected void onDestroy() {
        if (fileCallback != null) fileCallback.onReceiveValue(null);
        if (exports != null) exports.destroy();
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
        }
        super.onDestroy();
    }
}
