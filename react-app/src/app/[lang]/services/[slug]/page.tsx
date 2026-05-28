import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { PRODUCTS, getProduct } from "@/lib/catalog";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, LOCALES, localizedHref, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const params: { lang: Locale; slug: string }[] = [];
  for (const lang of LOCALES as readonly Locale[]) {
    for (const p of PRODUCTS) {
      params.push({ lang, slug: p.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const product = await getProduct(slug);
  if (!product) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: `${product.name[lang]} — ${dict.productDetail.metaTitleSuffix}`,
    description: product.blurb[lang],
    path: `/services/${slug}`,
  });
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const product = await getProduct(slug);
  if (!product) notFound();
  const dict = await getDictionary(lang);
  const t = dict.productDetail;
  const href = (p: string) => localizedHref(p, lang);

  const other = PRODUCTS.filter((p) => p.slug !== slug).slice(0, 4);

  return (
    <div className="page-product-detail">
      <section className="page-hero detail-hero">
        <div className="container">
          <nav className="crumbs">
            <Link href={href("/services")}>{t.crumbBack}</Link>
            <span className="sep">/</span>
            <span>{product.name[lang]}</span>
          </nav>
          <div className="hero-stack">
            <h1>{product.name[lang]}</h1>
            <p className="lede">{product.blurb[lang]}</p>
          </div>
        </div>
      </section>

      {product.images.length > 0 ? (
        <section className="gallery">
          <div className="container">
            <div className="head">
              <h5>
                {t.galleryHeading} ·{" "}
                {product.images.length.toString().padStart(2, "0")}
              </h5>
            </div>
            <GalleryLightbox
              images={product.images}
              alt={product.name[lang]}
              labels={{
                open: t.lightboxOpen,
                close: t.lightboxClose,
                prev: t.lightboxPrev,
                next: t.lightboxNext,
              }}
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
            {other.map((p) => (
              <Link
                key={p.slug}
                href={href(`/services/${p.slug}`)}
                className="related-card"
              >
                <h4>{p.name[lang]}</h4>
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
