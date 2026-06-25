import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/how-we-work">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.howWeWork.metaTitle,
    description: dict.howWeWork.metaDescription,
    path: "/how-we-work",
    keywords: dict.howWeWork.metaKeywords,
  });
}

export default async function HowWeWorkPage({
  params,
}: PageProps<"/[lang]/how-we-work">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.howWeWork;

  return (
    <div className="page-how-we-work">
      <section className="page-hero">
        <div className="container">
          <h1 style={{ whiteSpace: "pre-line" }}>
            {t.hero.h1Pre}
            <em>{t.hero.h1Em}</em>
          </h1>
          <p className="lede">{t.hero.lede}</p>
        </div>
      </section>

      <section className="reasons">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t.reasons.h2}</h2>
            </div>
          </div>
          <div className="reasons-grid">
            {t.reasons.items.map((r) => (
              <div key={r.num} className="r">
                <div className="num">{r.num}</div>
                <h4>{r.title}</h4>
                <p>{r.p}</p>
                <div className="metric">
                  <span className="v">{r.v}</span>
                  <span className="l">{r.l}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process">
        <div className="ornament"></div>
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t.process.h2}</h2>
            </div>
          </div>
          <div className="process-steps">
            {t.process.steps.map((s) => (
              <div key={s.n} className="process-step">
                <div className="n">{s.n}</div>
                <h6>{s.title}</h6>
                <div className="en">{s.en}</div>
                <p>{s.p}</p>
                <ul className="bullets">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABlock
        locale={lang}
        title={
          <>
            {dict.common.ctaBlockTitlePre}{" "}
            <em>{dict.common.ctaBlockTitleAccent}</em>
          </>
        }
        ctaLabel={dict.common.strategicBriefing}
      />
    </div>
  );
}
