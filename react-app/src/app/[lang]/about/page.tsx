import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
    path: "/about",
    keywords: dict.about.metaKeywords,
  });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.about;

  return (
    <div className="page-about">
      <section className="page-hero">
        <div className="container">
          <h1 style={{ whiteSpace: "pre-line" }}>
            {t.hero.h1Pre}
            <em>{t.hero.h1Em}</em>
          </h1>
          <div className="lede-row">
            <p className="lede">{t.hero.lede1}</p>
            <p className="lede">{t.hero.lede2}</p>
          </div>
          <div className="stats-line">
            {t.hero.stats.map((s, i) => (
              <div key={i} className="s">
                <div
                  className="v"
                  dangerouslySetInnerHTML={{ __html: s.v }}
                />
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="facility-hero">
        <div className="container">
          <div
            className="ph orange frame"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <div className="ph-grid"></div>
            <div
              className="ph-circle"
              style={{
                width: 480,
                height: 480,
                right: -120,
                top: -140,
              }}
            ></div>
            <div
              className="ph-para"
              style={{ left: "8%", top: "-20%", bottom: "-20%", width: 160 }}
            ></div>
            <div className="ph-tag">{t.facility.phTag}</div>
            <div className="ph-logo">{t.facility.phLogo}</div>
            <div className="ph-caption">
              {t.facility.phCaptionLine1}
              <br />
              {t.facility.phCaptionLine2}
            </div>
          </div>
        </div>
      </section>

      <section className="story">
        <div className="container">
          <h5>{t.story.h5}</h5>
          <div>
            <h2>
              {t.story.h2Pre}
              <br />
              <em>{t.story.h2Em}</em>
            </h2>
            <p>
              {t.story.p1Pre}{" "}
              <span className="accent">{t.story.p1Accent}</span>
              {t.story.p1Post}
            </p>
            <p>
              {t.story.p2Pre}{" "}
              <span className="accent">{t.story.p2AccentA}</span>{" "}
              {t.story.p2Mid}{" "}
              <span className="accent">{t.story.p2AccentB}</span>{" "}
              {t.story.p2Post}
            </p>
            <p>
              {t.story.p3Pre}{" "}
              <span className="accent">{t.story.p3Accent}</span>
              {t.story.p3Post}
            </p>
            <div className="pull">{t.story.pull}</div>
            <p>
              {t.story.p4Pre}{" "}
              <span className="accent">{t.story.p4AccentA}</span>{" "}
              {t.story.p4Mid}{" "}
              <span className="accent">{t.story.p4AccentB}</span>{" "}
              {t.story.p4Post}
            </p>
          </div>
        </div>
      </section>

      <section className="mvp">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.mvp.eyebrow}</div>
              <h2>{t.mvp.h2}</h2>
            </div>
            <div className="meta">
              {t.mvp.metaLine1}
              <br />
              {t.mvp.metaLine2}
            </div>
          </div>
          <div className="mvp-grid">
            {t.mvp.cards.map((c) => (
              <div key={c.label} className={c.feat ? "mvp-card feat" : "mvp-card"}>
                <div className="label">{c.label}</div>
                <h3>{c.h3}</h3>
                <p>{c.p}</p>
                {c.quote ? <div className="quote">{c.quote}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="values">
        <div className="container">
          <div className="section-head head">
            <div>
              <div className="eyebrow bar">{t.values.eyebrow}</div>
              <h2>{t.values.h2}</h2>
            </div>
            <div className="meta">
              {t.values.metaLine1}
              <br />
              {t.values.metaLine2}
            </div>
          </div>
          <div className="values-grid">
            {t.values.items.map((v) => (
              <div key={v.num} className="v">
                <div className="num">{v.num}</div>
                <h4>{v.h4}</h4>
                <p>{v.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="milestones">
        <div className="container">
          <div className="section-head head" style={{ marginBottom: 0 }}>
            <div>
              <div className="eyebrow bar">{t.milestones.eyebrow}</div>
              <h2>{t.milestones.h2}</h2>
            </div>
            <div className="meta">
              {t.milestones.metaLine1}
              <br />
              {t.milestones.metaLine2}
            </div>
          </div>
          <div className="milestones-grid">
            {t.milestones.items.map((m) => (
              <div key={m.y} className="ms">
                <div className="y">{m.y}</div>
                <h6>{m.h6}</h6>
                <p>{m.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="clients-wall">
        <div className="container">
          <div className="section-head head" style={{ marginBottom: 32 }}>
            <div>
              <div className="eyebrow bar">{t.clientsWall.eyebrow}</div>
              <h2>{t.clientsWall.h2}</h2>
            </div>
            <div className="meta">
              {t.clientsWall.metaLine1}
              <br />
              {t.clientsWall.metaLine2}
            </div>
          </div>
          <div className="clients-wall-grid">
            {t.clientsWall.items.map((c) => (
              <div key={c.name} className={c.style ? `c ${c.style}` : "c"}>
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <div className="section-head head" style={{ marginBottom: 0 }}>
            <div>
              <div className="eyebrow bar">{t.testimonials.eyebrow}</div>
              <h2>{t.testimonials.h2}</h2>
            </div>
            <div className="meta">
              {t.testimonials.metaLine1}
              <br />
              {t.testimonials.metaLine2}
            </div>
          </div>
          <div className="testimonials-grid">
            {t.testimonials.items.map((it, i) => (
              <div key={i} className="test">
                <div className="quote-mark">&quot;</div>
                <q>{it.quote}</q>
                <div className="attr">
                  <div className="who">
                    <h6>{it.whoTitle}</h6>
                    <div className="role">{it.whoRole}</div>
                  </div>
                  <span className="pending">{it.pendingLabel}</span>
                </div>
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
