import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Preserve link equity from the previous static .html site. These paths
  // contain a dot, so the i18n proxy matcher skips them and they reach here.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index-bundle.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/overview.html", destination: "/about", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      {
        source: "/service-pop-displays.html",
        destination: "/services",
        permanent: true,
      },
      { source: "/portfolio.html", destination: "/portfolio", permanent: true },
      {
        source: "/case-coca-cola-summer-endcap.html",
        destination: "/portfolio/coca-cola-summer-endcap",
        permanent: true,
      },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/quote.html", destination: "/quote", permanent: true },
      { source: "/sitemap.html", destination: "/sitemap", permanent: true },
    ];
  },
};

export default nextConfig;
