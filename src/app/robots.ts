import { MetadataRoute } from "next";
import { BrandConfig } from "../config/brand";

export const dynamic = "force-static";
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
    const baseUrl = BrandConfig.canonicalOrigin;

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/api/",
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
