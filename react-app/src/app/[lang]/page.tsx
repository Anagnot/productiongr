import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { HeroSlider } from "@/components/HeroSlider";
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

const PROCESS_ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>,
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
            <div className="actions">
              <Link href={href("/quote")} className="cta primary">
                {t.hero.cta}
              </Link>
            </div>
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

      <section className="channels">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.channels.eyebrow}</div>
              <h2>{t.channels.heading}</h2>
            </div>
          </div>
          <div className="channels-grid">
            {t.channels.items.map((c) => {
              const cover = channelCoverBySlug.get(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={href(`/channels/${c.slug}`)}
                  className="ch"
                  style={cover ? { backgroundImage: `url(${cover})` } : undefined}
                >
                  <div className="name">{c.name}</div>
                  <div className="en">{c.en}</div>
                </Link>
              );
            })}
            <Link href={href("/quote")} className="ch ch-cta">
              <div className="name">{t.channels.yourTitle}</div>
              <div className="en">{t.channels.yourSub}</div>
            </Link>
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
            <div className="eyebrow bar">{t.aboutStrip.eyebrow}</div>
            <h2>
              {t.aboutStrip.h2Pre}
              <br />
              <em>{t.aboutStrip.h2Em}</em>
            </h2>
            <p>{t.aboutStrip.body}</p>
            <div className="materials-pills">
              {t.aboutStrip.materials.map((m) => (
                <span key={m} className="pill">
                  {m}
                </span>
              ))}
            </div>
            <Link href={href("/about")} className="text-link">
              {t.aboutStrip.aboutLink}
            </Link>
          </div>
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
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.process.eyebrow}</div>
              <h2>{t.process.h2}</h2>
            </div>
          </div>
          <div className="process-steps">
            {t.process.steps.map((s, i) => (
              <div key={s.n} className="process-step">
                <div className="p-icon">{PROCESS_ICONS[i]}</div>
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
          <div className="process-cta">
            <Link href={href("/quote")} className="cta primary">
              {t.process.cta}
            </Link>
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
            <div className="certs">{t.sustain.certs}</div>
            <div className="sustain-cta">
              <Link href={href("/sustainability")} className="cta outline">
                {t.sustain.ctaFactsheet}
              </Link>
              <Link href={href("/quote")} className="cta primary">
                {t.sustain.ctaProject}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="clients">
        <div className="container">
          <div className="clients-row">
            {t.clients.items.map((c) => (
              <div key={c.name} className={c.style ? `c ${c.style}` : "c"}>
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
