export const SUPPORTED_LOCALES = ["en", "fr", "de", "hu", "it", "pt", "ro", "ru", "es"] as const;

export type Locale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: Locale = "en";

export const localeLabels: Record<
  Locale,
  { label: string; englishName: string; nativeName: string; htmlLang: string; hrefLang: string }
> = {
  en: { label: "English", englishName: "English", nativeName: "English", htmlLang: "en", hrefLang: "en" },
  fr: { label: "French", englishName: "French", nativeName: "Français", htmlLang: "fr", hrefLang: "fr" },
  de: { label: "German", englishName: "German", nativeName: "Deutsch", htmlLang: "de", hrefLang: "de" },
  hu: { label: "Hungarian", englishName: "Hungarian", nativeName: "Magyar", htmlLang: "hu", hrefLang: "hu" },
  it: { label: "Italian", englishName: "Italian", nativeName: "Italiano", htmlLang: "it", hrefLang: "it" },
  pt: { label: "Portuguese", englishName: "Portuguese", nativeName: "Português", htmlLang: "pt", hrefLang: "pt" },
  ro: { label: "Romanian", englishName: "Romanian", nativeName: "Română", htmlLang: "ro", hrefLang: "ro" },
  ru: { label: "Russian", englishName: "Russian", nativeName: "Русский", htmlLang: "ru", hrefLang: "ru" },
  es: { label: "Spanish", englishName: "Spanish", nativeName: "Español", htmlLang: "es", hrefLang: "es" },
};

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
