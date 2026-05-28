import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChannelCarousel } from "@/components/ChannelCarousel";
import { CTABlock } from "@/components/CTABlock";
import { getAllChannels } from "@/lib/catalog";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localizedHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import "@/styles/pages/channels.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/channels">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.channels.metaTitle,
    description: dict.channels.metaDescription,
    path: "/channels",
    keywords: dict.channels.metaKeywords,
  });
}

export default async function ChannelsPage({
  params,
}: PageProps<"/[lang]/channels">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.channels;
  const href = (p: string) => localizedHref(p, lang);
  const channels = await getAllChannels();
  const heroCarouselImages = channels
    .map((c) => c.cover)
    .filter((src): src is string => Boolean(src));

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="top-row">
            <h1>
              {t.hero.h1Pre} <em>{t.hero.h1Em}</em>
            </h1>
            <div className="hero-carousel">
              <ChannelCarousel
                images={heroCarouselImages}
                alt={t.gridHeading}
                prevLabel={t.carouselPrev}
                nextLabel={t.carouselNext}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="channels-grid-wrap">
        <div className="container">
          <div className="head">
            <h5>{t.gridHeading}</h5>
            <div className="total">
              {channels.length.toString().padStart(2, "0")} {t.totalLabel}
            </div>
          </div>
          <div className="channels-grid">
            {channels.map((c) => (
              <Link
                key={c.slug}
                href={href(`/channels/${c.slug}`)}
                className="channel-card"
              >
                <div className="channel-card-photo">
                  {c.cover ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={c.cover} alt={c.name[lang]} loading="lazy" />
                  ) : (
                    <div className="ph orange">
                      <div className="ph-grid" />
                    </div>
                  )}
                  <div className="channel-card-overlay" />
                </div>
                <div className="channel-card-body">
                  <h3>{c.name[lang]}</h3>
                  <p>{c.blurb[lang]}</p>
                  <div className="channel-card-meta">
                    <span className="count">
                      {c.images.length} {t.imagesLabel}
                    </span>
                    <span className="arrow">→</span>
                  </div>
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
