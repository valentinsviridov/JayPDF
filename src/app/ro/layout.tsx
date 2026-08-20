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

const LOCALE = "ro" as const;

export const viewport = SHARED_VIEWPORT;

export const metadata = {
  metadataBase: METADATA_BASE,
  title: "JayPDF - Unește, Comprimă, Divide și Convertește PDF-uri",
  description: "Instrumente PDF gratuite, online, pentru a uni, comprima, divide, extrage și converti. 100% privat, procesare locală în browserul tău.",
  icons: SHARED_ICONS,
  manifest: SHARED_MANIFEST,
  appleWebApp: SHARED_APPLE_WEB_APP,
  alternates: {
    canonical: "/ro/",
    languages: SHARED_ALTERNATES_LANGUAGES,
  },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: "JayPDF - Instrumente PDF gratuite și private în browserul tău",
    description: "Unește, comprimă, divide și convertește PDF-uri fără a încărca fișierele pe server. Securizat și 100% privat.",
    url: "/ro/",
    locale: "ro_RO",
    type: "website",
  },
  twitter: SHARED_TWITTER,
};

export default function RoLayout({ children }: { children: ReactNode }) {
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
