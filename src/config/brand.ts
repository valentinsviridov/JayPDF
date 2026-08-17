export const BrandConfig = {
  productName: "JayPDF",
  shortPromise: "Privacy-first, local PDF processing.",
  canonicalOrigin: process.env.NEXT_PUBLIC_SITE_URL || "https://jaypdf.org",
  contactEmail: "info@jaypdf.org",
  independentRepository: "https://github.com/valentinsviridov/JayPDF",
  gitRepository: "git@github.com:valentinsviridov/JayPDF.git",
  originalRepository: "https://github.com/GSiesto/PDFLince",
  assets: {
    logo: "/images/jaypdf-logo.png",
    favicon: "/favicon.png",
  },
  output: {
    filenamePrefix: "jaypdf_",
  },
  storage: {
    namespace: "jaypdf_app_",
  },
} as const;
