"use client";

import { useState, useEffect, useCallback } from "react";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    __pwaDeferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

// Check if running in PWA / standalone mode
export function isRunningInPwaMode(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as unknown as { standalone: boolean }).standalone === true) ||
    document.referrer.startsWith("android-app://") ||
    window.location.search.includes("source=pwa")
  );
}

// Global variable to catch beforeinstallprompt early
let savedPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    // If already in standalone mode, do nothing
    if (isRunningInPwaMode()) {
      return;
    }
    e.preventDefault();
    savedPrompt = e as BeforeInstallPromptEvent;
    window.__pwaDeferredPrompt = savedPrompt;
    promptListeners.forEach((listener) => listener(savedPrompt));
  });

  window.addEventListener("appinstalled", () => {
    savedPrompt = null;
    window.__pwaDeferredPrompt = null;
    promptListeners.forEach((listener) => listener(null));
  });
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== "undefined") {
      if (isRunningInPwaMode()) return null;
      return savedPrompt || window.__pwaDeferredPrompt || null;
    }
    return null;
  });
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return isRunningInPwaMode();
    }
    return false;
  });
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return isRunningInPwaMode();
    }
    return false;
  });

  useEffect(() => {
    const standaloneMode = isRunningInPwaMode();
    setIsStandalone(standaloneMode);
    if (standaloneMode) {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }

    // Listen for display mode media query changes
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsStandalone(true);
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    };

    if (standaloneQuery.addEventListener) {
      standaloneQuery.addEventListener("change", handleDisplayModeChange);
    }

    // Check if iOS/iPadOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleMobile =
      /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    setIsIOS(isAppleMobile);

    const updatePrompt = (prompt: BeforeInstallPromptEvent | null) => {
      if (isRunningInPwaMode()) {
        setDeferredPrompt(null);
        setIsInstalled(true);
        return;
      }
      setDeferredPrompt(prompt);
      if (!prompt) {
        setIsInstalled(true);
      }
    };

    if (!standaloneMode && window.__pwaDeferredPrompt && !deferredPrompt) {
      setDeferredPrompt(window.__pwaDeferredPrompt);
    }

    promptListeners.add(updatePrompt);
    return () => {
      promptListeners.delete(updatePrompt);
      if (standaloneQuery.removeEventListener) {
        standaloneQuery.removeEventListener("change", handleDisplayModeChange);
      }
    };
  }, [deferredPrompt]);

  const promptInstall = useCallback(async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    const prompt = deferredPrompt || (typeof window !== "undefined" ? window.__pwaDeferredPrompt : null);
    if (!prompt || isStandalone) {
      return "unavailable";
    }

    try {
      await prompt.prompt();
      const choiceResult = await prompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        savedPrompt = null;
        if (typeof window !== "undefined") {
          window.__pwaDeferredPrompt = null;
        }
        setDeferredPrompt(null);
      }
      return choiceResult.outcome;
    } catch (err) {
      console.warn("Install prompt error:", err);
      return "unavailable";
    }
  }, [deferredPrompt, isStandalone]);

  const canInstall = !isStandalone && !isInstalled;

  return {
    canInstall,
    isInstallPromptSupported: canInstall && (deferredPrompt !== null || (typeof window !== "undefined" && Boolean(window.__pwaDeferredPrompt))),
    isStandalone,
    isInstalled,
    isIOS,
    promptInstall,
  };
}
