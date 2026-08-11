export const BrandConfig = {
  productName: "PDFLince",
  shortPromise: "Privacy-first, local PDF processing.",
  canonicalOrigin: "https://pdflince.com", // Will be updated when new domain is selected
  contactEmail: "contact@pdflince.com",
  independentRepository: "https://github.com/valentinsviridov/PDFLince",
  originalRepository: "https://github.com/GSiesto/PDFLince",
  assets: {
    logo: "/images/pdflince-logo.svg",
    favicon: "/favicon.ico",
    ogImage: "/images/og-image.png",
  },
  output: {
    filenamePrefix: "pdflince_",
  },
  storage: {
    namespace: "pdflince_app_",
  },
} as const;
