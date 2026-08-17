import "../../styles/globals.css";
import { type ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import NavMenu from "../../components/NavMenu";
import Footer from "../../components/Footer";
import { LocaleProvider } from "../../i18n/LocaleProvider";
import { SchemaOrg } from "../../components/SchemaOrg";
import { BreadcrumbSchema } from "../../components/seo/BreadcrumbSchema";

import { METADATA_BASE, SHARED_ICONS, SHARED_OPEN_GRAPH, SHARED_TWITTER, SHARED_ALTERNATES_LANGUAGES } from "../../lib/metadata-shared";

const LOCALE = "de" as const;

export const metadata = {
  metadataBase: METADATA_BASE,
  title: "JayPDF - PDFs zusammenführen, komprimieren, teilen und konvertieren",
  description: "Kostenlose Online-PDF-Tools zum Zusammenführen, Komprimieren, Teilen, Extrahieren und Konvertieren von PDFs. 100% privat, lokale Verarbeitung in Ihrem Browser.",
  icons: SHARED_ICONS,
  alternates: {
    canonical: "/de/",
    languages: SHARED_ALTERNATES_LANGUAGES,
  },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: "JayPDF - Kostenlose und private PDF-Tools in Ihrem Browser",
    description: "PDFs zusammenführen, komprimieren, teilen und konvertieren, ohne Dateien hochzuladen. Sichere und 100% private Verarbeitung.",
    url: "/de/",
    locale: "de_DE",
    type: "website",
  },
  twitter: SHARED_TWITTER,
};

export default function DeLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={LOCALE}>
      <head>
        <title>{metadata.title}</title>
        <SchemaOrg />
        <BreadcrumbSchema />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <LocaleProvider locale={LOCALE}>
          <NavMenu />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
