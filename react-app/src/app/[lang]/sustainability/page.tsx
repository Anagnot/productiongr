import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

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
        <div className="container">
          <h1 style={{ whiteSpace: "pre-line" }}>
            {t.hero.h1Pre}
            <em>{t.hero.h1Em}</em>
          </h1>
          <p className="lede">{t.body}</p>
        </div>
      </section>

      <section className="sustain">
        <div className="container">
          <div className="visual">
            <div className="para"></div>
            <svg
              className="recycle"
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <g transform="rotate(0 100 100)">
                <path d="M 70 60 L 130 60" />
                <path d="M 122 52 L 130 60 L 122 68" />
              </g>
              <g transform="rotate(120 100 100)">
                <path d="M 70 60 L 130 60" />
                <path d="M 122 52 L 130 60 L 122 68" />
              </g>
              <g transform="rotate(240 100 100)" className="accent">
                <path d="M 70 60 L 130 60" />
                <path d="M 122 52 L 130 60 L 122 68" />
              </g>
            </svg>
            <div className="note">
              {t.noteLine1}
              <br />
              {t.noteLine2}
            </div>
          </div>
          <div>
            <div
              className="section-head"
              style={{ marginBottom: 0, display: "block" }}
            >
              <div className="eyebrow bar">{t.pillarsEyebrow}</div>
              <h2>{t.pillarsH2}</h2>
            </div>
            <div className="pillars">
              {t.pillars.map((p) => (
                <div key={p.n} className="pillar">
                  <div className="n">{p.n}</div>
                  <div>
                    <h6>{p.h6}</h6>
                    <p>{p.p}</p>
                  </div>
                </div>
              ))}
            </div>
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
          <div className="certs-grid">
            {t.certs.items.map((c) => (
              <a
                key={c.standard}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cert"
              >
                <div className="standard">{c.standard}</div>
                <div className="label">{c.label}</div>
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
        ctaHref="/contact"
      />
    </div>
  );
}
