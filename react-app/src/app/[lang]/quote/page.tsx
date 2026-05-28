import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuoteWizard } from "./QuoteWizard";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import "@/styles/pages/quote.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/quote">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.quote.metaTitle,
    description: dict.quote.metaDescription,
    path: "/quote",
    keywords: dict.quote.metaKeywords,
  });
}

export default async function QuotePage({
  params,
}: PageProps<"/[lang]/quote">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <QuoteWizard t={dict.quote} />;
}
