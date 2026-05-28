export const LOCALES = ["el", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "el";

export const LOCALE_LABELS: Record<Locale, { label: string; code: string }> = {
  el: { label: "Ελληνικά", code: "EL" },
  en: { label: "English", code: "EN" },
};

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localizedHref(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export function stripLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    if (pathname === `/${locale}`) return { locale, path: "/" };
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) };
    }
  }
  return { locale: DEFAULT_LOCALE, path: pathname };
}
