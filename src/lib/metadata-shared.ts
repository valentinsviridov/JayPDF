import { Metadata } from "next";

export const METADATA_BASE = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jaypdf.org");

export const SHARED_ICONS = [
    { rel: "icon", url: "/favicon.ico?v=3" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png?v=3" },
    { rel: "icon", type: "image/png", sizes: "48x48", url: "/favicon.png?v=3" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png?v=3" },
];

export const SHARED_OPEN_GRAPH: Metadata["openGraph"] = {
    type: "website",
};

export const SHARED_TWITTER: Metadata["twitter"] = {
    card: "summary",
};

export const SHARED_ALTERNATES_LANGUAGES = {
    'es-ES': '/es/',
    'es-MX': '/es/',
    'es-CO': '/es/',
    'es-AR': '/es/',
    'es': '/es/',
    'en': '/',
    'en-US': '/',
    'fr': '/fr/',
    'fr-FR': '/fr/',
    'pt': '/pt/',
    'pt-BR': '/pt/',
    'pt-PT': '/pt/',
    'de': '/de/',
    'de-DE': '/de/',
    'it': '/it/',
    'it-IT': '/it/',
    'ro': '/ro/',
    'ro-RO': '/ro/',
    'ru': '/ru/',
    'ru-RU': '/ru/',
    'hu': '/hu/',
    'hu-HU': '/hu/',
    'x-default': '/',
};
