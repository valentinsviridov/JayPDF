import PDFProcessor from "./pdf-processor";
import FaqSection from "./faq-section";
import type { OperationContent } from "../i18n/dictionaries/operation-types";

export function OperationPageContent({
  operation,
}: {
  operation: OperationContent;
}) {
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: operation.howTo.title,
    description: operation.hero.description,
    step: operation.howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.length > 80 ? `${operation.howTo.title} - ${index + 1}` : step,
      text: step,
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-soft relative">
      <div className="container mx-auto px-4 sm:px-6 py-8" style={{ maxWidth: "var(--max-width-wide-page)" }}>
        <section className="mb-8 relative">
          <div className="text-center md:text-left max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-[var(--tx)]">
              {operation.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--tx-2)] leading-relaxed">
              {operation.hero.description}
            </p>
          </div>
        </section>

        <PDFProcessor initialMode={operation.mode} />

        <section className="surface-card bg-white/90 border border-[var(--ui-2)] rounded-2xl p-6 sm:p-8 my-10 shadow-xs">
          <h2 className="text-xl font-bold mb-4 text-[var(--tx)]">{operation.howTo.title}</h2>
          <ol className="list-decimal list-inside space-y-2.5 text-[var(--tx-2)] text-sm sm:text-base leading-relaxed">
            {operation.howTo.steps.map((step, index) => (
              <li key={`${operation.slug}-step-${index}`}>{step}</li>
            ))}
          </ol>
          {operation.howTo.note && (
            <p className="mt-4 pt-3 border-t border-[var(--ui)] text-xs text-[var(--tx-3)]">{operation.howTo.note}</p>
          )}
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
        />

        <FaqSection />
      </div>
    </div>
  );
}
