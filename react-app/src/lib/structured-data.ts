import { localizedHref, type Locale } from "./i18n";
import { SITE_NAME, SITE_URL } from "./seo";

/** Absolute, locale-aware URL for a site path. */
export function absUrl(path: string, locale: Locale): string {
  return `${SITE_URL}${localizedHref(path, locale)}`;
}

type Crumb = { name: string; path: string };

/** BreadcrumbList for a detail page. `items` are ordered root → current. */
export function breadcrumbSchema(locale: Locale, items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absUrl(item.path, locale),
    })),
  };
}

/** ItemList for a listing page (products / channels grid). */
export function itemListSchema(
  locale: Locale,
  name: string,
  entries: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: entries.length,
    itemListElement: entries.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.name,
      url: absUrl(e.path, locale),
    })),
  };
}

/** Product schema for a build-type detail page. */
export function productSchema(
  locale: Locale,
  opts: { name: string; description: string; path: string; images?: string[]; category?: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    category: opts.category ?? "Retail display",
    url: absUrl(opts.path, locale),
    ...(opts.images && opts.images.length
      ? { image: opts.images.slice(0, 6).map((src) => `${SITE_URL}${src}`) }
      : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    manufacturer: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/** Service schema for a retail-channel detail page. */
export function serviceSchema(
  locale: Locale,
  opts: { name: string; description: string; path: string; images?: string[] },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${opts.name} display solutions`,
    serviceType: `Retail display solutions — ${opts.name}`,
    description: opts.description,
    url: absUrl(opts.path, locale),
    ...(opts.images && opts.images.length
      ? { image: opts.images.slice(0, 6).map((src) => `${SITE_URL}${src}`) }
      : {}),
    areaServed: { "@type": "Country", name: "Greece" },
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/** CreativeWork (case study) for a portfolio case page. */
export function caseStudySchema(
  locale: Locale,
  opts: { name: string; description: string; path: string; keywords?: string[] },
) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: opts.name,
    headline: opts.name,
    description: opts.description,
    url: absUrl(opts.path, locale),
    ...(opts.keywords && opts.keywords.length ? { keywords: opts.keywords.join(", ") } : {}),
    inLanguage: locale,
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    about: { "@type": "Thing", name: "Retail display & branded environment" },
  };
}
