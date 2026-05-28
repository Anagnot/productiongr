import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, type Locale, localizedHref } from "./i18n";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://production.gr";
export const SITE_NAME = "Production LTD";

export const OG_LOCALE_MAP: Record<Locale, string> = {
  el: "el_GR",
  en: "en_US",
};

export const HREFLANG_MAP: Record<Locale, string> = {
  el: "el-GR",
  en: "en-US",
};

export const DEFAULT_OG_IMAGE = "/assets/logomark-dark.svg";

export function buildLanguageAlternates(
  path: string,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const locale of LOCALES) {
    out[HREFLANG_MAP[locale]] = localizedHref(path, locale);
  }
  out["x-default"] = localizedHref(path, DEFAULT_LOCALE);
  return out;
}

type PageMetadataInput = {
  locale: Locale;
  title: string;
  description?: string;
  path: string;
  ogImage?: string;
  keywords?: string[];
};

export function pageMetadata({
  locale,
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  keywords,
}: PageMetadataInput): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = localizedHref(canonicalPath, locale);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(canonicalPath),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALE_MAP[locale],
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
