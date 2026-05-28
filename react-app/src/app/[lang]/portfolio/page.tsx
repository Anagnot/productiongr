import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { PortfolioFilters } from "./PortfolioFilters";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localizedHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import "@/styles/pages/portfolio.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/portfolio">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.portfolio.metaTitle,
    description: dict.portfolio.metaDescription,
    path: "/portfolio",
    keywords: dict.portfolio.metaKeywords,
  });
}

export default async function PortfolioPage({
  params,
}: PageProps<"/[lang]/portfolio">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.portfolio;
  const href = (p: string) => localizedHref(p, lang);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="top-row">
            <h1>
              {t.hero.h1Pre} <em>{t.hero.h1Em}</em>
            </h1>
            <p className="lede">{t.hero.lede}</p>
          </div>
        </div>
      </section>

      <PortfolioFilters
        typeTitle={t.filters.typeTitle}
        materialTitle={t.filters.materialTitle}
        channelTitle={t.filters.channelTitle}
        typeChips={t.filters.typeChips}
        materialChips={t.filters.materialChips}
        channelChips={t.filters.channelChips}
        countPill={t.filters.countPill}
      />

      <section className="featured-row">
        <div className="container">
          <Link
            href={href(t.featured.big.href)}
            className="featured-card big ph orange"
          >
            <div className="ph-grid"></div>
            <div
              className="ph-circle"
              style={{
                width: "420px",
                height: "420px",
                right: "-120px",
                top: "-120px",
              }}
            ></div>
            <div
              className="ph-para"
              style={{
                left: "12%",
                top: "-20%",
                bottom: "-20%",
                width: "160px",
              }}
            ></div>
            <div className="badge-feat">{t.featured.big.badge}</div>
            <div
              className="ph-tag"
              style={{ top: "auto", bottom: "90px", left: "22px" }}
            >
              {t.featured.big.phTag}
            </div>
            <div className="meta">
              <div className="eyebrow">{t.featured.big.eyebrow}</div>
              <h4>{t.featured.big.h4}</h4>
            </div>
          </Link>
          <div className="side">
            <Link
              href={href(t.featured.sideA.href)}
              className="featured-card ph dark"
            >
              <div className="ph-grid"></div>
              <div
                className="ph-circle"
                style={{
                  width: "200px",
                  height: "200px",
                  right: "-50px",
                  bottom: "-50px",
                }}
              ></div>
              <div className="ph-tag">{t.featured.sideA.phTag}</div>
              <div className="meta">
                <div className="eyebrow">{t.featured.sideA.eyebrow}</div>
                <h4>{t.featured.sideA.h4}</h4>
              </div>
            </Link>
            <Link
              href={href(t.featured.sideB.href)}
              className="featured-card ph gradient"
            >
              <div className="ph-grid"></div>
              <div
                className="ph-circle"
                style={{
                  width: "180px",
                  height: "180px",
                  left: "-40px",
                  top: "-40px",
                  background: "rgba(60,60,60,0.18)",
                }}
              ></div>
              <div
                className="ph-tag"
                style={{ color: "var(--color-gray-4)" }}
              >
                {t.featured.sideB.phTag}
              </div>
              <div className="meta dark">
                <div className="eyebrow">{t.featured.sideB.eyebrow}</div>
                <h4>{t.featured.sideB.h4}</h4>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid-wrap">
        <div className="container">
          <div className="head">
            <h5>{t.grid.head}</h5>
            <div className="sort">{t.grid.sort}</div>
          </div>
          <div className="uni-grid">
            {t.grid.items.map((item, i) => (
              <Link
                key={i}
                href={href(item.href)}
                className="work-card"
              >
                <div className={`ph ${item.ph}`}>
                  <div className="ph-grid"></div>
                  <div className="ph-tag">{item.phTag}</div>
                </div>
                <div className="info">
                  <div className="left">
                    <div className="yr">{item.yr}</div>
                    <h4>{item.h4}</h4>
                    <div className="client">{item.client}</div>
                  </div>
                  <div className="right">
                    <span
                      className={
                        item.tagOrange ? "tag-pill orange" : "tag-pill"
                      }
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="pager">
            <div className="pages">
              <Link href={href("/portfolio")} className="active">
                1
              </Link>
              <Link href={href("/portfolio")}>2</Link>
              <Link href={href("/portfolio")}>→</Link>
            </div>
            <div className="total">{t.grid.pagerTotal}</div>
          </div>
        </div>
      </section>

      <CTABlock
        locale={lang}
        title={
          <>
            {t.ctaTitlePre} <em>{t.ctaTitleEm}</em>
          </>
        }
        ctaLabel={dict.common.strategicBriefing}
      />
    </>
  );
}
