import type { Metadata } from "next";
import { Locale, DEFAULT_LOCALE, localeLabels } from "../../i18n/config";
import { getDictionary } from "../../i18n/get-dictionary";
import { getLocalizedAlternateMap } from "../../i18n/routing";

type StaticRouteKey = "home" | "faq" | "support";

function buildLanguagesMap(identifier: { type: "static"; key: StaticRouteKey }) {
  const alternatesMap = getLocalizedAlternateMap(identifier);
  const entries = (Object.entries(alternatesMap) as [Locale, string][]).map(([localeKey, path]) => {
    const hrefLang = localeLabels[localeKey].hrefLang;
    const pathWithSlash = path.endsWith("/") ? path : `${path}/`;
    return [hrefLang, pathWithSlash] as const;
  });

  const languages = Object.fromEntries(entries) as Record<string, string>;
  const defaultHref = localeLabels[DEFAULT_LOCALE].hrefLang;
  const xDefaultUrl = languages[defaultHref];
  return xDefaultUrl ? { ...languages, "x-default": xDefaultUrl } : languages;
}

export function createHomeMetadata(locale: Locale) {
  return (): Metadata => {
    const dictionary = getDictionary(locale);
    const siteMeta = dictionary.metadata.site;
    const languages = buildLanguagesMap({ type: "static", key: "home" });

    return {
      title: siteMeta.title,
      description: siteMeta.description,
      keywords: siteMeta.keywords,
      alternates: {
        canonical: siteMeta.canonical.endsWith("/") ? siteMeta.canonical : `${siteMeta.canonical}/`,
        languages,
      },
      openGraph: {
        title: siteMeta.openGraph.title,
        description: siteMeta.openGraph.description,
        url: siteMeta.openGraph.url,
        locale: siteMeta.openGraph.locale,
      },
    };
  };
}

export function createFaqMetadata(locale: Locale) {
  return (): Metadata => {
    const dictionary = getDictionary(locale);
    const faqMeta = dictionary.metadata.faq;
    const languages = buildLanguagesMap({ type: "static", key: "faq" });

    return {
      title: faqMeta.title,
      description: faqMeta.description,
      keywords: faqMeta.keywords,
      alternates: {
        canonical: faqMeta.canonical.endsWith("/") ? faqMeta.canonical : `${faqMeta.canonical}/`,
        languages,
      },
    };
  };
}

export function createSupportMetadata(locale: Locale) {
  return (): Metadata => {
    const dictionary = getDictionary(locale);
    const supportMeta = dictionary.metadata.support;
    const languages = buildLanguagesMap({ type: "static", key: "support" });

    return {
      title: supportMeta.title,
      description: supportMeta.description,
      keywords: supportMeta.keywords,
      robots: {
        index: false,
        follow: false,
      },
      alternates: {
        canonical: supportMeta.canonical.endsWith("/") ? supportMeta.canonical : `${supportMeta.canonical}/`,
        languages,
      },
    };
  };
}
