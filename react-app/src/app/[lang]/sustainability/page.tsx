import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const CERT_ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 20A7 7 0 0 1 9 6c4-2 8-1 10 1 0 6-4 12-8 13z" />
    <path d="M9 18c0-4 2-7 6-9" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
    <path d="M9.5 12l2 2 3.5-3.5" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>,
];

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/sustainability">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.sustainability.metaTitle,
    description: dict.sustainability.metaDescription,
    path: "/sustainability",
    keywords: dict.sustainability.metaKeywords,
  });
}

export default async function SustainabilityPage({
  params,
}: PageProps<"/[lang]/sustainability">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.sustainability;

  return (
    <div className="page-sustainability">
      <section className="page-hero">
        <div className="ornament-c"></div>
        <div className="ornament-p"></div>
        <div className="container">
          <h1>
            {t.hero.h1Pre}
            <em>{t.hero.h1Em}</em>
          </h1>
          <p className="lede">{t.body}</p>
        </div>
      </section>

      <section className="pillars">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.pillarsEyebrow}</div>
              <h2>{t.pillarsH2}</h2>
            </div>
          </div>
          <div className="pillars-grid">
            {t.pillars.map((p) => (
              <div key={p.h6} className="s-card">
                <div className="s-num">{p.n}</div>
                <h6>{p.h6}</h6>
                <p>{p.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="certs">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.certs.eyebrow}</div>
              <h2>{t.certs.h2}</h2>
            </div>
          </div>
          <div className="certs-row">
            {t.certs.items.map((c, i) => (
              <a
                key={c.standard}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cert"
              >
                <div className="cert-icon">{CERT_ICONS[i]}</div>
                <div>
                  <div className="cert-std">{c.standard}</div>
                  <div className="cert-label">{c.label}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTABlock
        locale={lang}
        title={
          <>
            {t.cta.titlePre} <em>{t.cta.titleEm}</em>
          </>
        }
        ctaLabel={t.cta.label}
      />
    </div>
  );
}
