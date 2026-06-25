import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { HeroSlider } from "@/components/HeroSlider";
import { getAllChannels } from "@/lib/catalog";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localizedHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

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

const CERT_ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 20A7 7 0 0 1 9 6c4-2 8-1 10 1 0 6-4 12-8 13z" />
    <path d="M9 18c0-4 2-7 6-9" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
    <path d="M9.5 12l2 2 3.5-3.5" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
  // Hero carousel = the first photo from each featured channel (in strip order).
  const heroSlides = channels
    .filter((c) => c.featured)
    .map((c) => c.images[0])
    .filter(Boolean);

  return (
    <div className="page-home">
      <section className="hero">
        <HeroSlider images={heroSlides} intervalMs={3400} />
        <div className="ornament-para"></div>
        <div className="ornament-circle"></div>
        <div className="container">
          <div>
            <h1>
              {lang === "el" ? (
                <>
                  <span>{t.hero.heading1}</span>
                  <span>{t.hero.heading2}</span>
                </>
              ) : (
                `${t.hero.heading1} ${t.hero.heading2}`
                  .split(" ")
                  .map((word, i) => <span key={i}>{word}</span>)
              )}
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
              <h2>
                {t.channels.heading} <em>{t.channels.headingEm}</em>
              </h2>
            </div>
          </div>
          <p className="ch-lede">{t.channels.lede}</p>
          <div className="channels-grid">
            {t.channels.items.map((c) => {
              const cover = channelCoverBySlug.get(c.slug);
              const isNew = c.slug === "exhibitions" || c.slug === "events";
              return (
                <Link
                  key={c.slug}
                  href={href(`/channels/${c.slug}`)}
                  className="ch"
                  style={cover ? { backgroundImage: `url(${cover})` } : undefined}
                >
                  {isNew && <span className="new-badge">{t.channels.newLabel}</span>}
                  <span className="ch-arrow" aria-hidden="true">→</span>
                  <div className="name">{c.name}</div>
                  <div className="en">{c.en}</div>
                </Link>
              );
            })}
            <Link href={href("/quote")} className="ch ch-cta">
              <span className="ch-arrow" aria-hidden="true">→</span>
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
              <h2>{t.reasons.h2}</h2>
            </div>
          </div>
          <div className="reasons-grid">
            {t.reasons.items.map((r) => (
              <div key={r.title} className="r">
                <div className="metric">
                  <span className="v">{r.v}</span>
                  <span className="l">{r.l}</span>
                </div>
                <h4>{r.title}</h4>
                <p>{r.p}</p>
              </div>
            ))}
          </div>
          <div className="reasons-more">
            <Link href={href("/how-we-work")} className="text-link">
              {t.reasons.seeAll}
            </Link>
          </div>
        </div>
      </section>

      <section className="process">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t.process.h2}</h2>
            </div>
          </div>
          <div className="process-steps">
            {t.process.steps.map((s, i) => (
              <div key={s.n} className="process-step">
                <div className="p-num">{(i + 1).toString().padStart(2, "0")}</div>
                <div className="p-icon">{PROCESS_ICONS[i]}</div>
                <h6>{s.title}</h6>
                <p>{s.p}</p>
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
          <h2>{t.sustain.h2}</h2>
          <p className="sustain-lede">{t.sustain.p}</p>
          <div className="sustain-pillars">
            {t.sustain.pillars.map((p) => (
              <div key={p.h6} className="s-card">
                <div className="s-num">{p.n}</div>
                <div className="s-sub">{p.sub}</div>
                <h6>{p.h6}</h6>
                <p>{p.p}</p>
              </div>
            ))}
          </div>
          <div className="certs-title">{t.sustain.certsTitle}</div>
          <div className="certs-row">
            {t.sustain.certsItems.map((c, i) => (
              <a
                key={c.standard}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cert"
              >
                <div className="cert-icon">{CERT_ICONS[i]}</div>
                <div>
                  <div className="cert-std">{c.standard}</div>
                  <div className="cert-label">{c.label}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="sustain-cta">
            <Link href={href("/quote")} className="cta primary">
              {t.sustain.ctaProject}
            </Link>
          </div>
        </div>
      </section>

      {/* TEMP: client logos strip hidden per request — restore by un-commenting this block
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
      */}

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
