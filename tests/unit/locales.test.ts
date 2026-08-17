import { describe, expect, test } from "bun:test";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, localeLabels } from "../../src/i18n/config";

describe("Locale Configuration", () => {
  test("should have English as the first locale", () => {
    expect(SUPPORTED_LOCALES[0]).toBe("en");
    expect(DEFAULT_LOCALE).toBe("en");
  });

  test("should sort non-English languages alphabetically by their English name", () => {
    const nonEnglishLocales = SUPPORTED_LOCALES.filter(l => l !== "en");
    const englishNames = nonEnglishLocales.map(l => localeLabels[l].englishName);
    
    const sortedEnglishNames = [...englishNames].sort((a, b) => a.localeCompare(b, "en"));
    expect(englishNames).toEqual(sortedEnglishNames);
  });
});
