import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services/special-projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const t = dict.services.specialProjects;
  return pageMetadata({
    locale: lang,
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/services/special-projects",
  });
}

export default async function SpecialProjectsPage({
  params,
}: PageProps<"/[lang]/services/special-projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.services.specialProjects;

  return (
    <div className="page-special-projects">
      <section className="page-hero">
        <div className="container">
          <h1 style={{ whiteSpace: "pre-line" }}>
            {t.hero.h1Pre}
            <em>{t.hero.h1Em}</em>
          </h1>
          <p className="lede">{t.lede}</p>
        </div>
      </section>

      <section className="sp-intro">
        <div className="container">
          <div className="sp-intro-text">
            <div className="eyebrow bar">{t.cardEyebrow}</div>
            <h2>{t.introHeading}</h2>
            <p>{t.intro}</p>
          </div>
          <div className="sp-highlights">
            <h6>{t.highlightsHeading}</h6>
            <ul>
              {t.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
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
        ctaLabel={t.cta}
      />
    </div>
  );
}
