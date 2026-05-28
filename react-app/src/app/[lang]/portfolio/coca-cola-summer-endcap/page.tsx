import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localizedHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/portfolio/coca-cola-summer-endcap">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.cocaCola.metaTitle,
    description: dict.cocaCola.metaDescription,
    path: "/portfolio/coca-cola-summer-endcap",
    keywords: dict.cocaCola.metaKeywords,
  });
}

export default async function CocaColaSummerEndcapPage({
  params,
}: PageProps<"/[lang]/portfolio/coca-cola-summer-endcap">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.cocaCola;
  const href = (p: string) => localizedHref(p, lang);

  return (
    <div className="page-case-coca-cola">
      <section className="case-hero">
        <div className="container">
          <h1>
            {t.hero.h1Line1}
            <br />
            {t.hero.h1Line2}
          </h1>
          <p className="lede">{t.hero.lede}</p>
          <div className="case-meta">
            {t.hero.meta.map((m) => (
              <div key={m.h6} className="m">
                <h6>{m.h6}</h6>
                <div className="v">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bigvisual">
        <div className="container">
          <div
            className="ph orange frame"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <div className="ph-grid"></div>
            <div
              className="ph-circle"
              style={{
                width: "460px",
                height: "460px",
                right: "-120px",
                top: "-160px",
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
            <div className="ph-tag">{t.bigvisual.phTag}</div>
            <div className="ph-logo">{t.bigvisual.phLogo}</div>
            <div className="ph-caption">
              {t.bigvisual.phCaptionLine1}
              <br />
              {t.bigvisual.phCaptionLine2}
            </div>
          </div>
          <div className="caption">
            <span>{t.bigvisual.captionLeft}</span>
            <span>{t.bigvisual.captionRight}</span>
          </div>
        </div>
      </section>

      <section className="narrative">
        <div className="container">
          <h5>{t.narrative.h5}</h5>
          <div>
            <h2>{t.narrative.h2}</h2>
            <p>
              {t.narrative.p1Pre}{" "}
              <span className="accent">{t.narrative.p1Accent}</span>{" "}
              {t.narrative.p1Post}
            </p>
            <p>{t.narrative.p2}</p>
          </div>
        </div>
      </section>

      <section className="specs-block">
        <div className="container">
          <div>
            <div className="eyebrow bar" style={{ marginBottom: "14px" }}>
              {t.specs.eyebrow}
            </div>
            <h2>{t.specs.h2}</h2>
            <p>{t.specs.p}</p>
            <Link href={href("/services")} className="cta outline">
              {t.specs.ctaLabel}
            </Link>
          </div>
          <div className="specs-table">
            {t.specs.rows.map((row) => (
              <div className="row" key={row.h6}>
                <h6>{row.h6}</h6>
                <div className="v">{row.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery">
        <div className="container">
          <div
            className="ph orange img wide"
            style={{ borderRadius: "var(--radius-md)" }}
          >
            <div className="ph-grid"></div>
            <div
              className="ph-circle"
              style={{
                width: "280px",
                height: "280px",
                left: "-80px",
                bottom: "-80px",
              }}
            ></div>
            <div className="ph-tag">{t.gallery.hero.phTag}</div>
            <div className="ph-caption">
              {t.gallery.hero.phCaptionLine1}
              <br />
              {t.gallery.hero.phCaptionLine2}
            </div>
          </div>
        </div>
      </section>
      <section className="gallery">
        <div className="container">
          {t.gallery.items.map((g, i) => (
            <div
              key={i}
              className={`ph ${g.ph} img`}
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <div className="ph-grid"></div>
              <div className="ph-tag">{g.phTag}</div>
              <div
                className="ph-caption"
                style={g.captionDark ? { color: "var(--color-gray-4)" } : undefined}
              >
                {g.captionLine1}
                {g.captionLine2 ? (
                  <>
                    <br />
                    {g.captionLine2}
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="timeline">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.timeline.eyebrow}</div>
              <h2>{t.timeline.h2}</h2>
            </div>
            <div className="meta">
              {t.timeline.metaLine1}
              <br />
              {t.timeline.metaLine2}
            </div>
          </div>
          <div className="timeline-grid">
            {t.timeline.steps.map((s) => (
              <div key={s.week} className="step">
                <div className="week">{s.week}</div>
                <h6>{s.h6}</h6>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pullquote">
        <div className="container">
          <q>
            {t.pullquote.qPre}{" "}
            <span className="accent">{t.pullquote.qAccent}</span>
            {t.pullquote.qPost}
          </q>
          <div className="attr">
            {t.pullquote.attrName}{" "}
            <span className="role">{t.pullquote.attrRole}</span>
          </div>
        </div>
      </section>

      <section className="results">
        <div className="container">
          <div className="head">
            <div>
              <div
                className="eyebrow bar"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {t.results.eyebrow}
              </div>
              <h2>
                {t.results.h2Line1}
                <br />
                <em>{t.results.h2Em}</em>
              </h2>
            </div>
            <p>{t.results.p}</p>
          </div>
          <div className="results-grid">
            {t.results.items.map((r, i) => (
              <div key={i} className="r">
                <div
                  className="v"
                  dangerouslySetInnerHTML={{ __html: r.v }}
                />
                <div className="l">{r.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Link
        href={href("/portfolio")}
        className="next"
        style={{ display: "block" }}
      >
        <div className="container">
          <div>
            <h5>{t.next.h5}</h5>
            <div className="title">{t.next.title}</div>
          </div>
          <div className="arrow">→</div>
        </div>
      </Link>
    </div>
  );
}
