package org.jaypdf.app;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.Uri;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class PrivacyTest {
    @Test public void bundleWorksWithoutNetworkPermission() throws Exception {
        Context app = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals(PackageManager.PERMISSION_DENIED, app.checkSelfPermission(Manifest.permission.INTERNET));
        BundledContent content = new BundledContent(app.getAssets());
        for (String route : new String[]{"/", "/fr/", "/privacy/", "/licenses/", "/pdf.worker.min.js", "/wasm/openjpeg.wasm"}) {
            try (var input = content.respond(Uri.parse(BundledContent.ORIGIN + route)).getData()) {
                assertTrue(route, input.read() != -1);
            }
        }
        assertEquals(403, content.respond(Uri.parse("https://example.com/track")).getStatusCode());
        assertEquals(403, content.respond(Uri.parse("https://appassets.androidplatform.net:443/")).getStatusCode());
        assertEquals(403, content.respond(Uri.parse("file:///data/data/org.jaypdf.app/")).getStatusCode());
        assertEquals(404, content.respond(Uri.parse(BundledContent.ORIGIN + "/missing.js")).getStatusCode());
        assertEquals(403, content.respond(Uri.parse(BundledContent.ORIGIN + "/../private")).getStatusCode());
    }
}
