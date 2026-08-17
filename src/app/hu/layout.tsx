import "../../styles/globals.css";
import { type ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import NavMenu from "../../components/NavMenu";
import Footer from "../../components/Footer";
import { LocaleProvider } from "../../i18n/LocaleProvider";
import { SchemaOrg } from "../../components/SchemaOrg";
import { BreadcrumbSchema } from "../../components/seo/BreadcrumbSchema";

import { METADATA_BASE, SHARED_ICONS, SHARED_OPEN_GRAPH, SHARED_TWITTER } from "../../lib/metadata-shared";

const LOCALE = "hu" as const;

export const metadata = {
  metadataBase: METADATA_BASE,
  title: "JayPDF - PDF tömörítése, egyesítése, felosztása és konvertálása",
  description: "Ingyenes online PDF-eszközök: tömörítés, egyesítés, felosztás, kinyerés és konvertálás. 100% privát, helyi feldolgozás a böngésződben.",
  icons: SHARED_ICONS,
  alternates: {
    canonical: "https://pdflince.com/hu/",
    languages: {
      'es-ES': 'https://pdflince.com/es/',
      'es-MX': 'https://pdflince.com/es/',
      'es-CO': 'https://pdflince.com/es/',
      'es-AR': 'https://pdflince.com/es/',
      'es': 'https://pdflince.com/es/',
      'en': 'https://pdflince.com/',
      'en-US': 'https://pdflince.com/',
      'fr': 'https://pdflince.com/fr/',
      'fr-FR': 'https://pdflince.com/fr/',
      'pt': 'https://pdflince.com/pt/',
      'pt-BR': 'https://pdflince.com/pt/',
      'pt-PT': 'https://pdflince.com/pt/',
      'de': 'https://pdflince.com/de/',
      'de-DE': 'https://pdflince.com/de/',
      'it': 'https://pdflince.com/it/',
      'it-IT': 'https://pdflince.com/it/',
      'ro': 'https://pdflince.com/ro/',
      'ro-RO': 'https://pdflince.com/ro/',
      'ru': 'https://pdflince.com/ru/',
      'ru-RU': 'https://pdflince.com/ru/',
      'hu': 'https://pdflince.com/hu/',
      'hu-HU': 'https://pdflince.com/hu/',
      'x-default': 'https://pdflince.com/',
    },
  },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    images: [{ url: "https://pdflince.com/og-images/og-image-hu.png", width: 1409, height: 736, alt: "JayPDF - Privát és ingyenes PDF-feldolgozás" }],
    title: "JayPDF - Ingyenes és privát PDF-eszközök a böngésződben",
    description: "Egyesítsd, tömörítsd, oszd fel és konvertáld a PDF-eket szerverre feltöltés nélkül. Biztonságos és 100% privát.",
    url: "https://pdflince.com/hu",
    locale: "hu_HU",
    type: "website",
  },
  twitter: SHARED_TWITTER,
};

export default function HuLayout({ children }: { children: ReactNode }) {
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
