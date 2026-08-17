import "../../styles/globals.css";
import { type ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import NavMenu from "../../components/NavMenu";
import Footer from "../../components/Footer";
import { LocaleProvider } from "../../i18n/LocaleProvider";
import { SchemaOrg } from "../../components/SchemaOrg";
import { BreadcrumbSchema } from "../../components/seo/BreadcrumbSchema";
import { localeLabels, DEFAULT_LOCALE, isLocale } from "../../i18n/config";

import { METADATA_BASE, SHARED_ICONS, SHARED_OPEN_GRAPH, SHARED_TWITTER, SHARED_ALTERNATES_LANGUAGES } from "../../lib/metadata-shared";

export const metadata = {
  metadataBase: METADATA_BASE,
  title: "JayPDF - Merge, Compress, Split, and Convert PDFs Online",
  description: "Free online PDF tools to merge, compress, split, extract, and convert PDFs. 100% private, local processing in your browser.",
  keywords: "merge pdf, compress pdf, split pdf, extract pdf pages, rotate pdf pages, reorder pdf, pdf to images, images to pdf, convert pdf, edit pdf offline",
  icons: SHARED_ICONS,
  alternates: {
    canonical: "/",
    languages: SHARED_ALTERNATES_LANGUAGES,
  },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: "JayPDF - Free and Private PDF Tools in Your Browser",
    description: "Merge, compress, split, and convert PDFs without uploading files. Secure and 100% private processing.",
    url: "/",
    locale: "en_US",
    type: "website",
  },
  twitter: SHARED_TWITTER,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const resolvedParams = await params;
  const requestedLocale = resolvedParams?.locale;
  const locale = requestedLocale && isLocale(requestedLocale) ? requestedLocale : DEFAULT_LOCALE;
  const htmlLang = localeLabels[locale].htmlLang;

  return (
    <html lang={htmlLang}>
      <head>
        <title>{metadata.title}</title>
        <SchemaOrg />
        <BreadcrumbSchema />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <LocaleProvider locale={locale}>
          <NavMenu />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
