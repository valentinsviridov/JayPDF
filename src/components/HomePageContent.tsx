import PDFProcessor from "./pdf-processor";
import type { Dictionary } from "../i18n/dictionaries/dictionary-types";

export function HomePageContent({ dictionary }: { dictionary: Dictionary }) {
  const {
    pages: { home },
  } = dictionary;

  return (
    <div className="min-h-screen bg-gradient-soft relative">
      <div className="container mx-auto px-4 sm:px-6 py-8" style={{ maxWidth: "var(--max-width-wide-page)" }}>
        <section className="mb-8 relative">
          <div className="text-center md:text-left max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-[var(--tx)]">
              {home.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--tx-2)] leading-relaxed">
              {home.hero.subtitle}
            </p>
          </div>
        </section>

        <PDFProcessor />
      </div>
    </div>
  );
}
