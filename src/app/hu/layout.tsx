import "../../styles/globals.css";
import { type ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import NavMenu from "../../components/NavMenu";
import Footer from "../../components/Footer";
import { LocaleProvider } from "../../i18n/LocaleProvider";
import { SchemaOrg } from "../../components/SchemaOrg";
import { BreadcrumbSchema } from "../../components/seo/BreadcrumbSchema";

import { METADATA_BASE, SHARED_ICONS, SHARED_OPEN_GRAPH, SHARED_TWITTER, SHARED_ALTERNATES_LANGUAGES, SHARED_MANIFEST, SHARED_APPLE_WEB_APP, SHARED_VIEWPORT } from "../../lib/metadata-shared";

const LOCALE = "hu" as const;

export const viewport = SHARED_VIEWPORT;

export const metadata = {
  metadataBase: METADATA_BASE,
  title: "JayPDF - PDF tömörítése, egyesítése, felosztása és konvertálása",
  description: "Ingyenes online PDF-eszközök: tömörítés, egyesítés, felosztás, kinyerés és konvertálás. 100% privát, helyi feldolgozás a böngésződben.",
  icons: SHARED_ICONS,
  manifest: SHARED_MANIFEST,
  appleWebApp: SHARED_APPLE_WEB_APP,
  alternates: {
    canonical: "/hu/",
    languages: SHARED_ALTERNATES_LANGUAGES,
  },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: "JayPDF - Ingyenes és privát PDF-eszközök a böngésződben",
    description: "Egyesítsd, tömörítsd, oszd fel és konvertáld a PDF-eket szerverre feltöltés nélkül. Biztonságos és 100% privát.",
    url: "/hu/",
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
