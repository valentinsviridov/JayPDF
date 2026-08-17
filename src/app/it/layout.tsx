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

const LOCALE = "it" as const;

export const metadata = {
  metadataBase: METADATA_BASE,
  title: "JayPDF - Merge, Compress, Split, and Convert PDFs Online",
  description: "Free online PDF tools to merge, compress, split, extract, and convert PDFs. 100% private, local processing in your browser.",
  icons: SHARED_ICONS,
  alternates: {
    canonical: "/it/",
    languages: SHARED_ALTERNATES_LANGUAGES,
  },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: "JayPDF - Strumenti PDF gratuiti e privati nel tuo browser",
    description: "Unisci, comprimi, dividi e converti PDF senza dover caricare i file online. Elaborazione sicura e completamente privata.",
    url: "/it/",
    locale: "it_IT",
    type: "website",
  },
  twitter: SHARED_TWITTER,
};

export default function ItLayout({ children }: { children: ReactNode }) {
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
