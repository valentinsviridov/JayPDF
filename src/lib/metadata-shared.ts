import { Metadata } from "next";

export const METADATA_BASE = new URL("https://pdflince.com");

export const SHARED_ICONS = [
    { rel: "icon", url: "/favicon.ico?v=2" },
    { rel: "apple-touch-icon", url: "/favicon.ico?v=2" },
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
