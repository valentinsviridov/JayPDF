import { Metadata } from "next";

export const METADATA_BASE = new URL("https://pdflince.com");

export const SHARED_ICONS = [
    { rel: "icon", url: "/favicon.ico?v=3" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png?v=3" },
    { rel: "icon", type: "image/png", sizes: "48x48", url: "/favicon.png?v=3" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png?v=3" },
];

export const SHARED_OPEN_GRAPH: Metadata["openGraph"] = {
    images: [
        {
            url: "https://pdflince.com/og-images/og-image-es.png",
            width: 1409,
            height: 736,
            alt: "JayPDF - Procesamiento de PDFs privado y gratuito"
        }
    ],
};

export const SHARED_TWITTER: Metadata["twitter"] = {
    card: "summary_large_image",
};
