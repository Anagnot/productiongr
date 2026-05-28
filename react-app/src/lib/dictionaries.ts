import "server-only";
import type { Locale } from "./i18n";

const dictionaries = {
  el: () => import("@/messages/el.json").then((m) => m.default),
  en: () => import("@/messages/en.json").then((m) => m.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["el"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
