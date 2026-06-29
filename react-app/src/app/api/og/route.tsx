import { renderOgImage } from "@/lib/og-image";

// Stable 1200x630 social card at /api/og, referenced explicitly by every
// page's Open Graph + Twitter metadata. (The /api/* path is excluded from the
// i18n proxy matcher, so it is served directly.)
export const dynamic = "force-static";

export function GET() {
  return renderOgImage();
}
