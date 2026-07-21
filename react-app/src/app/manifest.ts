import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Display Solutions & Branded Environments`,
    short_name: SITE_NAME,
    description:
      "Display solutions & branded environments that win the shopper's eye in the first 3 seconds. Industrialized Craft in Acharnes, Greece, since 2008.",
    start_url: "/",
    display: "standalone",
    background_color: "#141414",
    theme_color: "#e65c00",
    icons: [
      {
        src: "/assets/favicon-transparent.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/favicon-background.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
