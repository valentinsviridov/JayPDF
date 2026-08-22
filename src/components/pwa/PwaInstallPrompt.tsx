"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Sparkles, Smartphone, X } from "lucide-react";
import { usePwaInstall } from "./usePwaInstall";
import { useDictionary } from "../../i18n/LocaleProvider";

interface PwaInstallPromptProps {
  variant?: "card" | "banner" | "compact";
  className?: string;
}

export function PwaInstallPrompt({
  className = "",
}: PwaInstallPromptProps) {
  const dictionary = useDictionary();
  const t = dictionary.components?.pwaPrompt || {
    title: "Install JayPDF App",
    badge: "Offline Ready",
    description: "Add JayPDF to your device for instant, 100% private offline PDF editing anytime.",
    installButton: "Install App",
    addToHomeScreen: "Add to Home Screen",
    iosGuideTitle: "How to install on mobile:",
    iosStep1Pre: "In your browser (e.g. Safari or Chrome), tap the ",
    shareLabel: "Share",
    orLabel: " or ",
    menuLabel: "Menu",
    iosStep1Post: " button ( ⎋ / ⋮ ).",
    iosStep2Pre: "Scroll and select ",
    iosStep3: "Launch JayPDF directly from your home screen with complete offline support!",
  };

  const { canInstall, isStandalone, isInstalled, isIOS, isInstallPromptSupported, promptInstall } = usePwaInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [installStatus, setInstallStatus] = useState<"idle" | "installing" | "installed">("idle");

  // Do not show installation suggestion when running in PWA mode or already installed
  if (isStandalone || isInstalled || installStatus === "installed" || !canInstall) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallPromptSupported) {
      setInstallStatus("installing");
      const outcome = await promptInstall();
      if (outcome === "accepted") {
        setInstallStatus("installed");
      } else {
        setInstallStatus("idle");
      }
    } else if (isIOS) {
      setShowIosGuide((prev) => !prev);
    } else {
      setShowIosGuide((prev) => !prev);
    }
  };

  return (
    <div
      data-testid="pwa-install-banner"
      className={`rounded-xl border border-[var(--ui-2)] bg-gradient-to-r from-[var(--bg-2)] to-orange-50/40 p-4 shadow-sm transition-all hover:border-[var(--accent)]/40 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--ui-2)] bg-white p-1 shadow-xs">
            <Image
              src="/images/jaypdf-favicon.png"
              alt="JayPDF App"
              width={32}
              height={32}
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-[var(--tx)]">{t.title}</h4>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                <Sparkles className="h-2.5 w-2.5" />
                {t.badge}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[var(--tx-2)]">
              {t.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            data-testid="pwa-install-button"
            type="button"
            onClick={handleInstallClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[var(--accent-2)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {isInstallPromptSupported ? (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>{t.installButton}</span>
              </>
            ) : isIOS ? (
              <>
                <Smartphone className="h-3.5 w-3.5" />
                <span>{t.addToHomeScreen}</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>{t.installButton}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showIosGuide && (
        <div className="mt-3 rounded-lg border border-[var(--ui-3)] bg-white p-3 text-xs text-[var(--tx-2)]">
          <div className="flex items-center justify-between font-semibold text-[var(--tx)]">
            <span className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-[var(--accent)]" />
              {t.iosGuideTitle}
            </span>
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="text-[var(--tx-3)] hover:text-[var(--tx)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] text-[var(--tx-2)]">
            <li>
              {t.iosStep1Pre}
              <span className="font-semibold">{t.shareLabel}</span>
              {t.orLabel}
              <span className="font-semibold">{t.menuLabel}</span>
              {t.iosStep1Post}
            </li>
            <li>
              {t.iosStep2Pre}
              <span className="font-semibold">&quot;{t.addToHomeScreen}&quot;</span>
              {t.orLabel}
              <span className="font-semibold">&quot;{t.installButton}&quot;</span>.
            </li>
            <li>
              {t.iosStep3}
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default PwaInstallPrompt;
