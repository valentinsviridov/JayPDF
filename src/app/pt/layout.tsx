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

const LOCALE = "pt" as const;

export const viewport = SHARED_VIEWPORT;

export const metadata = {
  metadataBase: METADATA_BASE,
  title: "JayPDF - Juntar, Comprimir, Dividir e Converter PDFs Online",
  description: "Ferramentas de PDF online gratuitas para juntar, comprimir, dividir, extrair e converter PDFs. 100% privado, processamento local no seu navegador.",
  icons: SHARED_ICONS,
  manifest: SHARED_MANIFEST,
  appleWebApp: SHARED_APPLE_WEB_APP,
  alternates: {
    canonical: "/pt/",
    languages: SHARED_ALTERNATES_LANGUAGES,
  },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: "JayPDF - Ferramentas de PDF gratuitas e privadas no seu navegador",
    description: "Combine, comprima, divida e converta PDFs sem carregar arquivos. Processamento seguro e 100% privado.",
    url: "/pt/",
    locale: "pt_BR",
    type: "website",
  },
  twitter: SHARED_TWITTER,
};

export default function PtLayout({ children }: { children: ReactNode }) {
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
