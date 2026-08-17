export const BrandConfig = {
  productName: "JayPDF",
  shortPromise: "Privacy-first, local PDF processing.",
  canonicalOrigin: "https://pdflince.com",
  contactEmail: "contact@pdflince.com",
  independentRepository: "https://github.com/valentinsviridov/PDFLince",
  originalRepository: "https://github.com/GSiesto/PDFLince",
  assets: {
    logo: "/images/pdflince-logo.svg",
    favicon: "/favicon.ico",
    ogImage: "/images/og-image.png",
  },
  output: {
    filenamePrefix: "jaypdf_",
  },
  storage: {
    namespace: "jaypdf_app_",
  },
} as const;
