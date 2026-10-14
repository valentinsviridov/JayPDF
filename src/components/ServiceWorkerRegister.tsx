"use client";

import { useEffect } from "react";
import { isAndroidApp } from '../lib/platform';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (isAndroidApp()) return;
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window.location.protocol === "https:" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      const preloadOfflineAssets = () => {
        // Preload operations in background during idle time so they are cached by Service Worker
        const runPreload = async () => {
          try {
            const { preloadAllPdfOperations } = await import("../modules/pdf/registry");
            await preloadAllPdfOperations();
            await import("pdfjs-dist/legacy/build/pdf");
          } catch {
            // Ignore preload errors
          }
        };

        if ("requestIdleCallback" in window) {
          (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
            runPreload();
          });
        } else {
          setTimeout(runPreload, 1000);
        }
      };

      const registerServiceWorker = () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            preloadOfflineAssets();
            registration.addEventListener("updatefound", () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.addEventListener("statechange", () => {
                  if (
                    installingWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    // New service worker version installed
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.warn("ServiceWorker registration failed:", error);
          });
      };

      if (document.readyState === "complete") {
        registerServiceWorker();
      } else {
        window.addEventListener("load", registerServiceWorker);
        return () => window.removeEventListener("load", registerServiceWorker);
      }
    }
  }, []);

  return null;
}
