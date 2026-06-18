import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChannelCarousel } from "@/components/ChannelCarousel";
import { CTABlock } from "@/components/CTABlock";
import { CHANNELS, getChannel } from "@/lib/catalog";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, LOCALES, localizedHref, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const params: { lang: Locale; slug: string }[] = [];
  for (const lang of LOCALES as readonly Locale[]) {
    for (const c of CHANNELS) {
      params.push({ lang, slug: c.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/channels/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const channel = await getChannel(slug);
  if (!channel) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: `${channel.name[lang]} — ${dict.channels.metaTitleSuffix}`,
    description: channel.blurb[lang],
    path: `/channels/${slug}`,
  });
}

export default async function ChannelDetailPage({
  params,
}: PageProps<"/[lang]/channels/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const channel = await getChannel(slug);
  if (!channel) notFound();
  const dict = await getDictionary(lang);
  const t = dict.channels;
  const href = (p: string) => localizedHref(p, lang);

  const other = CHANNELS.filter((c) => c.slug !== slug && c.inMenu).slice(0, 4);
  const intro = channel.details?.intro[lang] ?? [channel.blurb[lang]];
  const highlights =
    channel.details?.highlights[lang] ?? channel.bullets?.[lang] ?? [];
  const hasContent = Boolean(channel.details || channel.bullets);

  return (
    <div className="page-channel-detail">
      <section
        className={`page-hero detail-hero${channel.cover ? " has-banner" : ""}`}
        style={
          channel.cover
            ? { backgroundImage: `url(${channel.cover})` }
            : undefined
        }
      >
        <div className="container">
          <nav className="crumbs">
            <Link href={href("/channels")}>{t.crumbBack}</Link>
            <span className="sep">/</span>
            <span>{channel.name[lang]}</span>
          </nav>
          <div className="hero-stack">
            <h1>{channel.name[lang]}</h1>
            {channel.tagline && <p className="tagline">{channel.tagline}</p>}
            <p className="lede">{channel.blurb[lang]}</p>
          </div>
        </div>
      </section>

      {hasContent && (
        <section className="channel-content">
          <div className="container">
            <div className="content-grid">
              <div>
                <div className="content-eyebrow">{t.contentEyebrow}</div>
                <h2>{t.contentHeading}</h2>
                <div className="content-body">
                  {intro.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <Link
                  href={href(`/services?channel=${slug}`)}
                  className="products-link"
                >
                  {t.productsForChannel}
                </Link>
              </div>
              {highlights.length > 0 && (
                <ul className="highlights">
                  {highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {channel.images.length > 0 ? (
        <section className="gallery">
          <div className="container">
            <ChannelCarousel
              photos={channel.photos}
              alt={channel.name[lang]}
              prevLabel={t.carouselPrev}
              nextLabel={t.carouselNext}
              pauseLabel={t.carouselPause}
              playLabel={t.carouselPlay}
              openLabel={t.lightboxOpen}
              closeLabel={t.lightboxClose}
            />
          </div>
        </section>
      ) : (
        <section className="empty-state">
          <div className="container">
            <p>{t.emptyState}</p>
          </div>
        </section>
      )}

      <section className="related">
        <div className="container">
          <div className="head">
            <h5>{t.relatedHeading}</h5>
          </div>
          <div className="related-grid">
            {other.map((c) => (
              <Link
                key={c.slug}
                href={href(`/channels/${c.slug}`)}
                className="related-card"
              >
                <h4>{c.name[lang]}</h4>
                <span className="arrow">→</span>
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
    </div>
  );
}
