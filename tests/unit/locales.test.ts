import { describe, expect, test } from "bun:test";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, localeLabels } from "../../src/i18n/config";
import { getDictionary } from "../../src/i18n/get-dictionary";

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

  test("should have valid pwaPrompt and feedback strings for all supported locales", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const dict = getDictionary(locale);
      expect(Boolean(dict)).toBe(true);
      expect(Boolean(dict.components.pwaPrompt)).toBe(true);
      expect(dict.components.pwaPrompt.title.length).toBeGreaterThan(0);
      expect(dict.components.pwaPrompt.badge.length).toBeGreaterThan(0);
      expect(dict.components.pwaPrompt.description.length).toBeGreaterThan(0);
      expect(dict.components.pwaPrompt.installButton.length).toBeGreaterThan(0);
      expect(dict.components.pwaPrompt.addToHomeScreen.length).toBeGreaterThan(0);
      expect(dict.components.pwaPrompt.iosGuideTitle.length).toBeGreaterThan(0);
      expect(dict.components.pwaPrompt.iosStep3.length).toBeGreaterThan(0);

      expect(Boolean(dict.components.feedback)).toBe(true);
      expect(dict.components.feedback.question.length).toBeGreaterThan(0);
      expect(dict.components.feedback.thanks.length).toBeGreaterThan(0);
    }
  });
});

