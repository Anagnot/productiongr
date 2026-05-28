import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force deterministic CSS load order. The default ("true") lets Next.js
  // merge/re-order CSS chunks, which broke our cascade on SPA navigations:
  // page CSS depends on tokens.css/site.css, and responsive.css must stay
  // after site.css. "strict" loads files in the exact import order.
  experimental: {
    cssChunking: "strict",
  },
};

export default nextConfig;
