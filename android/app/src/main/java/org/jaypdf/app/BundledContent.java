package org.jaypdf.app;

import android.content.res.AssetManager;
import android.net.Uri;
import android.webkit.WebResourceResponse;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;

/** Every request is answered locally, including missing files and foreign origins. */
final class BundledContent {
    static final String ORIGIN = "https://appassets.androidplatform.net";
    private final WebViewAssetLoader loader;

    BundledContent(AssetManager assets) {
        loader = new WebViewAssetLoader.Builder().addPathHandler("/", path -> {
            if (path.contains("..") || path.contains("\\")) return empty(403, "Forbidden");
            if (path.isEmpty() || path.endsWith("/")) path += "index.html";
            try {
                String mime = URLConnection.guessContentTypeFromName(path);
                if (path.endsWith(".js") || path.endsWith(".mjs")) mime = "text/javascript";
                if (path.endsWith(".css")) mime = "text/css";
                if (path.endsWith(".wasm")) mime = "application/wasm";
                if (path.endsWith(".json")) mime = "application/json";
                if (path.endsWith(".woff2")) mime = "font/woff2";
                if (mime == null) mime = "application/octet-stream";
                Map<String, String> headers = new HashMap<>();
                headers.put("X-Content-Type-Options", "nosniff");
                headers.put("Cache-Control", "no-store");
                headers.put("Content-Security-Policy", "default-src 'none'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self' blob:; worker-src 'self' blob:; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'");
                return new WebResourceResponse(mime, "UTF-8", 200, "OK", headers, assets.open("web/" + path));
            } catch (IOException missing) {
                return empty(404, "Not Found");
            }
        }).build();
    }

    static boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && "appassets.androidplatform.net".equals(uri.getHost())
                && uri.getPort() == -1 && uri.getUserInfo() == null;
    }

    WebResourceResponse respond(Uri uri) {
        if (!isLocal(uri)) return empty(403, "Forbidden");
        WebResourceResponse response = loader.shouldInterceptRequest(uri);
        return response != null ? response : empty(404, "Not Found");
    }

    private static WebResourceResponse empty(int code, String reason) {
        return new WebResourceResponse("text/plain", "UTF-8", code, reason, java.util.Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
    }
}
