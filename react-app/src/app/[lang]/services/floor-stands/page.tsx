import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localizedHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import "@/styles/pages/floor-stands.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services/floor-stands">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.floorStands.metaTitle,
    description: dict.floorStands.metaDescription,
    path: "/services/floor-stands",
    keywords: dict.floorStands.metaKeywords,
  });
}

export default async function FloorStandsPage({
  params,
}: PageProps<"/[lang]/services/floor-stands">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.floorStands;
  const href = (p: string) => localizedHref(p, lang);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <h1>
                {t.hero.h1Line1}
                <br />
                {t.hero.h1Line2}
              </h1>
            </div>
            <p className="lede">{t.hero.lede}</p>
          </div>
          <div className="spec-strip">
            {t.hero.spec.map((s) => (
              <div key={s.h6} className="s">
                <h6>{s.h6}</h6>
                <div className="v">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hero-photo">
        <div className="container">
          <div
            className="ph orange frame"
            style={{ aspectRatio: "21/9", borderRadius: "var(--radius-lg)" }}
          >
            <div className="ph-grid"></div>
            <div
              className="ph-circle"
              style={{
                width: 380,
                height: 380,
                right: -100,
                top: -100,
              }}
            ></div>
            <div
              className="ph-para"
              style={{ left: "8%", top: "-20%", bottom: "-20%", width: 160 }}
            ></div>
            <div className="ph-tag">{t.heroPhoto.phTag}</div>
            <div className="ph-logo">{t.heroPhoto.phLogo}</div>
            <div className="ph-caption">
              {t.heroPhoto.phCaptionLine1}
              <br />
              {t.heroPhoto.phCaptionLine2}
            </div>
          </div>
        </div>
      </section>

      <section className="materials-detail">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.materials.eyebrow}</div>
              <h2>
                {t.materials.h2Line1}
                <br />
                {t.materials.h2Line2}
              </h2>
            </div>
            <div className="meta">
              {t.materials.metaLine1}
              <br />
              {t.materials.metaLine2}
            </div>
          </div>
          <div className="mat-grid">
            {t.materials.items.map((m, idx) => {
              const phCls =
                idx === 0
                  ? "ph warm frame"
                  : idx === 1
                  ? "ph dark frame"
                  : idx === 2
                  ? "ph cool frame"
                  : "ph yellow frame";
              return (
                <div className="mat" key={m.n}>
                  <div className={phCls}>
                    <div className="ph-grid"></div>
                    <div
                      className="ph-circle"
                      style={
                        idx === 0
                          ? { width: 200, height: 200, right: -60, top: -60 }
                          : idx === 1
                          ? {
                              width: 220,
                              height: 220,
                              left: -60,
                              bottom: -60,
                            }
                          : idx === 2
                          ? {
                              width: 180,
                              height: 180,
                              right: -40,
                              top: 40,
                              background: "rgba(230,92,0,0.18)",
                            }
                          : undefined
                      }
                    ></div>
                    {idx === 1 ? (
                      <div
                        className="ph-para"
                        style={{
                          right: "10%",
                          top: 0,
                          bottom: 0,
                          width: 100,
                        }}
                      ></div>
                    ) : null}
                    {idx === 3 ? (
                      <div
                        className="ph-para"
                        style={{
                          left: "20%",
                          top: "-20%",
                          bottom: "-20%",
                          width: 120,
                          background: "rgba(60,60,60,0.18)",
                        }}
                      ></div>
                    ) : null}
                    <div className="ph-tag">{m.phTag}</div>
                    <div
                      className="ph-caption"
                      style={
                        idx === 2 ? { color: "var(--color-gray-4)" } : undefined
                      }
                    >
                      {m.phCaptionLine1}
                      <br />
                      {m.phCaptionLine2}
                    </div>
                  </div>
                  <div className="body">
                    <div className="n">{m.n}</div>
                    <div>
                      <h3>{m.h3}</h3>
                      <div className="en">{m.en}</div>
                      <p>{m.p}</p>
                      <div className="specs">
                        {m.tags.map((tg, i) => (
                          <span
                            key={tg}
                            className={
                              i === 0 && idx === 0
                                ? "tag-pill orange"
                                : "tag-pill"
                            }
                          >
                            {tg}
                          </span>
                        ))}
                      </div>
                      <div className="mini-data">
                        {m.data.map((d) => (
                          <div key={d.k} className="item">
                            <div className="k">{d.k}</div>
                            <div className="v">{d.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="mat" style={{ gridColumn: "1 / -1" }}>
              <div
                className="ph gradient frame"
                style={{ aspectRatio: "16/6" }}
              >
                <div className="ph-grid"></div>
                <div
                  className="ph-circle"
                  style={{
                    width: 320,
                    height: 320,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%,-50%)",
                    background: "rgba(60,60,60,0.18)",
                  }}
                ></div>
                <div
                  className="ph-para"
                  style={{
                    left: 0,
                    top: "-20%",
                    bottom: "-20%",
                    width: 140,
                    background: "rgba(60,60,60,0.22)",
                  }}
                ></div>
                <div
                  className="ph-tag"
                  style={{ color: "var(--color-gray-4)" }}
                >
                  {t.materials.plexi.phTag}
                </div>
                <div
                  className="ph-caption"
                  style={{ color: "var(--color-gray-4)" }}
                >
                  {t.materials.plexi.phCaption}
                </div>
              </div>
              <div className="body">
                <div className="n">{t.materials.plexi.n}</div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 32,
                    alignItems: "start",
                  }}
                >
                  <div>
                    <h3>{t.materials.plexi.h3}</h3>
                    <div className="en">{t.materials.plexi.en}</div>
                    <p>{t.materials.plexi.p}</p>
                    <div className="specs">
                      {t.materials.plexi.tags.map((tg, i) => (
                        <span
                          key={tg}
                          className={
                            i === 0 ? "tag-pill orange" : "tag-pill"
                          }
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="mini-data"
                    style={{ borderTop: 0, paddingTop: 0 }}
                  >
                    {t.materials.plexi.data.map((d) => (
                      <div key={d.k} className="item">
                        <div className="k">{d.k}</div>
                        <div className="v">{d.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="two-col">
        <div className="container">
          <div
            className="ph gradient visual"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <div className="ph-grid"></div>
            <div
              className="ph-circle"
              style={{
                width: "60%",
                aspectRatio: 1,
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                background: "rgba(60,60,60,0.18)",
              }}
            ></div>
            <div
              className="ph-para"
              style={{
                left: 0,
                top: "-10%",
                bottom: "-10%",
                width: 140,
                background: "rgba(60,60,60,0.22)",
              }}
            ></div>
            <div className="ph-tag">{t.twoCol.phTag}</div>
            <div
              className="ph-caption"
              style={{ color: "var(--color-gray-4)" }}
            >
              {t.twoCol.phCaptionLine1}
              <br />
              {t.twoCol.phCaptionLine2}
            </div>
          </div>
          <div>
            <div className="eyebrow bar" style={{ marginBottom: 14 }}>
              {t.twoCol.eyebrow}
            </div>
            <h2>{t.twoCol.h2}</h2>
            <p>{t.twoCol.p}</p>
            <div className="checklist">
              {t.twoCol.checklist.map((it) => (
                <div className="item" key={it.h6}>
                  <div className="dot"></div>
                  <div>
                    <h6>{it.h6}</h6>
                    <p>{it.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="channels-fit">
        <div className="container">
          <div className="section-head head">
            <div>
              <div className="eyebrow bar">{t.channelsFit.eyebrow}</div>
              <h2>{t.channelsFit.h2}</h2>
            </div>
            <div className="meta">
              {t.channelsFit.metaLine1}
              <br />
              {t.channelsFit.metaLine2}
            </div>
          </div>
          <div className="channels-grid">
            {t.channelsFit.items.map((c) => (
              <div className="ch" key={c.n}>
                <div className="num">{c.n}</div>
                <h6>{c.title}</h6>
                <p>{c.p}</p>
                <div className="fit-bar">
                  <div className="label">{c.label}</div>
                  <div className="track">
                    <div className="fill" style={{ width: `${c.w}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="related-work">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.relatedWork.eyebrow}</div>
              <h2>{t.relatedWork.h2}</h2>
            </div>
            <Link href={href("/portfolio")} className="cta outline">
              {t.relatedWork.allLink}
            </Link>
          </div>
          <div className="related-grid">
            {t.relatedWork.items.map((w, i) => (
              <Link key={i} href={href(w.href)} className={w.cls}>
                <div className="ph-grid"></div>
                {w.withCircle ? (
                  <div
                    className="ph-circle"
                    style={{
                      width: 280,
                      height: 280,
                      right: -80,
                      bottom: -80,
                    }}
                  ></div>
                ) : null}
                <div className="ph-tag">{w.phTag}</div>
                <div className={w.dark ? "meta dark" : "meta"}>
                  <div className="eyebrow">{w.eyebrow}</div>
                  <h4>{w.h4}</h4>
                </div>
              </Link>
            ))}
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
