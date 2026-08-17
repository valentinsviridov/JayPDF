export const BrandConfig = {
  productName: "JayPDF",
  shortPromise: "Privacy-first, local PDF processing.",
  canonicalOrigin: "https://pdflince.com",
  contactEmail: "contact@pdflince.com",
  independentRepository: "https://github.com/valentinsviridov/JayPDF",
  gitRepository: "git@github.com:valentinsviridov/JayPDF.git",
  originalRepository: "https://github.com/GSiesto/PDFLince",
  assets: {
    logo: "/images/jaypdf-logo.svg",
    favicon: "/favicon.svg",
    ogImage: "/images/og-image.png",
  },
  output: {
    filenamePrefix: "jaypdf_",
  },
  storage: {
    namespace: "jaypdf_app_",
  },
} as const;
