import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { HeroSlider } from "@/components/HeroSlider";
import { ServicesGrid } from "@/components/ServicesGrid";
import { getAllChannels } from "@/lib/catalog";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localizedHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const HERO_SLIDES = [
  "/uploads/products/displays/C_01.jpg",
  "/uploads/products/shelves/MMarket_02.jpg",
  "/uploads/products/counter-stands/A1.jpg",
  "/uploads/products/floor-stands/C03.png",
  "/uploads/products/pallet-stands/3.jpg",
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
  const channels = await getAllChannels();
  const channelCoverBySlug = new Map(
    channels.map((c) => [c.slug, c.cover] as const),
  );

  return (
    <div className="page-home">
      <section className="hero">
        <HeroSlider images={HERO_SLIDES} intervalMs={3400} />
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
            {t.channels.items.map(([num, name, en, slug]) => {
              const cover = channelCoverBySlug.get(slug);
              return (
                <div
                  key={num}
                  className="ch"
                  style={
                    cover
                      ? { backgroundImage: `url(${cover})` }
                      : undefined
                  }
                >
                  <div className="num">{num}</div>
                  <div className="name">{name}</div>
                  <div className="en">{en}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about-strip">
        <div className="container">
          <div className="visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="photo"
              src="/uploads/home/about-laser.jpg"
              alt=""
            />
            <div className="circle"></div>
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
    </div>
  );
}
