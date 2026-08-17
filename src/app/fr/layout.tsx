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

const LOCALE = "fr" as const;

export const metadata = {
  metadataBase: METADATA_BASE,
  title: "JayPDF - Fusionner, Compresser, Diviser et Convertir des PDF",
  description: "Outils PDF gratuits en ligne pour fusionner, compresser, diviser, extraire et convertir. 100% privé, traitement local dans votre navigateur.",
  icons: SHARED_ICONS,
  alternates: {
    canonical: "/fr/",
    languages: SHARED_ALTERNATES_LANGUAGES,
  },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: "JayPDF - Outils PDF gratuits et privés dans votre navigateur",
    description: "Fusionnez, compressez, divisez et convertissez des PDF sans télécharger de fichiers. Sécurisé et 100% privé.",
    url: "/fr/",
    locale: "fr_FR",
    type: "website",
  },
  twitter: SHARED_TWITTER,
};

export default function FrLayout({ children }: { children: ReactNode }) {
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
