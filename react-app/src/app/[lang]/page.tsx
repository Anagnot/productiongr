import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { HeroSlider } from "@/components/HeroSlider";
import { ServicesGrid } from "@/components/ServicesGrid";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localizedHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import "@/styles/pages/home.css";

const HERO_SLIDES = [
  "/uploads/pasted-1779174116570-0.png",
  "/uploads/pasted-1779174450215-0.png",
  "/uploads/pasted-1779174464775-0.png",
  "/uploads/pasted-1779174550520-0.png",
  "/uploads/pasted-1779174710698-0.png",
];

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.home.metaTitle,
    description: dict.home.metaDescription,
    path: "/",
  });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.home;
  const href = (p: string) => localizedHref(p, lang);

  return (
    <>
      <section className="hero">
        <HeroSlider images={HERO_SLIDES} intervalMs={1700} />
        <div className="ornament-para"></div>
        <div className="ornament-circle"></div>
        <div className="container">
          <div>
            <h1>
              {t.hero.heading1}
              <br />
              {t.hero.heading2}
            </h1>
            <p className="lede">{t.hero.lede}</p>
          </div>
          <div className="stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="big-p" src="/assets/logomark-dark.svg" alt="" />
          </div>
        </div>
      </section>

      <section className="channels">
        <div className="container">
          <div className="head">
            <h5>{t.channels.eyebrow}</h5>
            <div className="right">{t.channels.right}</div>
          </div>
          <div className="channels-grid">
            {t.channels.items.map(([num, name, en]) => (
              <div key={num} className="ch">
                <div className="num">{num}</div>
                <div className="name">{name}</div>
                <div className="en">{en}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-strip">
        <div className="container">
          <div className="visual">
            <div className="para"></div>
            <div className="ph-grid"></div>
            <div className="circle"></div>
            <div className="signature">
              <span className="marker" style={{ whiteSpace: "pre-line" }}>
                {t.aboutStrip.signature}
              </span>
            </div>
          </div>
          <div>
            <h2>
              {t.aboutStrip.h2Pre}
              <br />
              <em>{t.aboutStrip.h2Em}</em>
            </h2>
            <p>
              {t.aboutStrip.p1Pre}{" "}
              <span className="accent">{t.aboutStrip.p1Accent}</span>{" "}
              {t.aboutStrip.p1Post}
            </p>
            <p>
              {t.aboutStrip.p2Pre}{" "}
              <span className="accent">{t.aboutStrip.p2Accent}</span>{" "}
              {t.aboutStrip.p2Post}
            </p>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.services.eyebrow}</div>
              <h2>{t.services.h2}</h2>
            </div>
            <div className="meta">{t.services.meta}</div>
          </div>
          <ServicesGrid
            featBig={t.services.featBig}
            featBigHref={href("/services")}
            items={t.services.items.map((s) => ({ ...s, href: href(s.href) }))}
            allHref={href("/services")}
            allLabel={t.services.allLink}
          />

        </div>
      </section>

      <section className="reasons">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.reasons.eyebrow}</div>
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

      <section className="work">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.work.eyebrow}</div>
              <h2>{t.work.h2}</h2>
            </div>
            <Link href={href("/portfolio")} className="cta outline">
              {t.work.allLink}
            </Link>
          </div>
          <div className="work-grid home-work-grid">
            {t.work.items.map((w, i) => (
              <Link key={i} href={href(w.href)} className="tile">
                <div className={`bg ${w.bg}`}></div>
                {w.withGrid ? (
                  <div
                    className="ph-grid"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  ></div>
                ) : null}
                {w.ornaments.includes("circle") ? (
                  <div className="ornament circle"></div>
                ) : null}
                {w.ornaments.includes("para") ? (
                  <div className="ornament para"></div>
                ) : null}
                {w.badge ? <div className="badge">{w.badge}</div> : null}
                <div className={w.dark ? "meta dark" : "meta"}>
                  <div className="eyebrow">{w.eyebrow}</div>
                  <h4>{w.h4}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="process">
        <div className="ornament"></div>
        <div className="container">
          <div className="section-head">
            <div>
              <div
                className="eyebrow bar"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {t.process.eyebrow}
              </div>
              <h2>{t.process.h2}</h2>
            </div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t.process.metaLine1}
              <br />
              {t.process.metaLine2}
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

      <section className="materials">
        <div className="container">
          <h5>{t.materials.title}</h5>
          <div className="materials-list">
            {t.materials.items.map((m) => (
              <span key={m} className="m">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {t.stats.map((s, i) => (
              <div key={i} className="stat">
                <div
                  className="num"
                  dangerouslySetInnerHTML={{ __html: s.value }}
                />
                <div className="label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sustain">
        <div className="container">
          <div className="visual">
            <div className="para"></div>
            <div className="circle"></div>
            <div className="note">
              {t.sustain.noteLine1}
              <br />
              {t.sustain.noteLine2}
            </div>
          </div>
          <div>
            <div
              className="section-head"
              style={{ marginBottom: 0, display: "block" }}
            >
              <div className="eyebrow bar" style={{ marginBottom: 10 }}>
                {t.sustain.eyebrow}
              </div>
              <h2>{t.sustain.h2}</h2>
            </div>
            <p>{t.sustain.p}</p>
            <div className="pillars">
              {t.sustain.pillars.map((p) => (
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

      <section className="clients">
        <div className="container">
          <h5>{t.clients.title}</h5>
          <div className="clients-row">
            {t.clients.items.map((c) => (
              <div
                key={c.name}
                className={c.style ? `c ${c.style}` : "c"}
              >
                {c.name}
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
    </>
  );
}
