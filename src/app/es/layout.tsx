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

const LOCALE = "es" as const;

export const viewport = SHARED_VIEWPORT;

export const metadata = {
  metadataBase: METADATA_BASE,
  title: "JayPDF | Comprimir, unir, dividir y convertir PDF online sin subir archivos",
  description:
    "Procesa tus PDFs gratis: comprimir PDF, unir PDF, dividir PDF, extraer páginas y convertir PDF a imágenes o imágenes a PDF directamente en tu navegador. Todo es local y 100% privado.",
  keywords:
    "comprimir pdf, unir pdf, dividir pdf, extraer paginas pdf, convertir pdf, pdf a imagen, imagen a pdf, reorganizar pdf, herramienta pdf gratis, pdf sin subir archivos",
  icons: SHARED_ICONS,
  manifest: SHARED_MANIFEST,
  appleWebApp: SHARED_APPLE_WEB_APP,
  alternates: {
    canonical: "/es/",
    languages: SHARED_ALTERNATES_LANGUAGES,
  },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: "JayPDF | Herramientas PDF privadas y gratuitas en tu navegador",
    description:
      "Une, comprime, divide, extrae y convierte PDFs sin subir archivos. Resultados al instante con procesamiento 100% local y privado.",
    url: "/es/",
    locale: "es_ES",
    type: "website",
  },
  twitter: SHARED_TWITTER,
};

export default function EsLayout({ children }: { children: ReactNode }) {
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
