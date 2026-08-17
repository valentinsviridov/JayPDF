import PDFProcessor from "./pdf-processor";
import type { Dictionary } from "../i18n/dictionaries/dictionary-types";
import JayPdfLogo from "./JayPdfLogo";

export function HomePageContent({ dictionary }: { dictionary: Dictionary }) {
  const {
    pages: { home },
  } = dictionary;

  return (
    <div className="min-h-screen bg-gradient-soft relative">
      <div className="container mx-auto px-4 sm:px-6 py-8" style={{ maxWidth: "var(--max-width-wide-page)" }}>
        <section className="mb-10 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left md:max-w-[75%]">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-[var(--tx)]">
                {home.hero.title}
              </h1>
              <p className="text-lg md:text-xl text-[var(--tx-2)] max-w-3xl leading-relaxed">
                {home.hero.subtitle}
              </p>
            </div>

            <div className="hidden md:flex justify-end md:w-[25%]">
              <div className="p-4 rounded-2xl bg-white/60 border border-[var(--ui-2)] shadow-xs backdrop-blur-xs">
                <JayPdfLogo className="w-36 h-36" />
              </div>
            </div>
          </div>
        </section>

        <PDFProcessor />
      </div>
    </div>
  );
}
