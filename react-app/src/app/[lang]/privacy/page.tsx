import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
    path: "/privacy",
  });
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.privacy;

  return (
    <section className="page-hero legal-page">
      <div className="container" style={{ maxWidth: 820 }}>
        <h1>{t.h1}</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          {t.updated}
        </p>
        <div style={{ marginTop: 32, display: "grid", gap: 28 }}>
          {t.sections.map((s, i) => (
            <div key={i}>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>{s.h}</h2>
              <p style={{ lineHeight: 1.7 }}>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
