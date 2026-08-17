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

const LOCALE = "ru" as const;

export const metadata = {
  metadataBase: METADATA_BASE,
  title: "JayPDF - Сжать, объединить, разделить и конвертировать PDF",
  description: "Бесплатные онлайн-инструменты для PDF: сжатие, объединение, разделение, извлечение и конвертация. 100% конфиденциально, локальная обработка в браузере.",
  icons: SHARED_ICONS,
  alternates: {
    canonical: "/ru/",
    languages: SHARED_ALTERNATES_LANGUAGES,
  },
  openGraph: {
    ...SHARED_OPEN_GRAPH,
    title: "JayPDF - Бесплатные и конфиденциальные инструменты для PDF в браузере",
    description: "Объединяйте, сжимайте, делите и конвертируйте PDF без загрузки на сервер. Безопасно и 100% конфиденциально.",
    url: "/ru/",
    locale: "ru_RU",
    type: "website",
  },
  twitter: SHARED_TWITTER,
};

export default function RuLayout({ children }: { children: ReactNode }) {
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
