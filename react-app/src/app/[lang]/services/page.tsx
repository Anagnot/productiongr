import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { getAllProducts } from "@/lib/catalog";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localizedHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.services.metaTitle,
    description: dict.services.metaDescription,
    path: "/services",
    keywords: dict.services.metaKeywords,
  });
}

function dotClass(c: string) {
  if (c === "weak") return "dot weak";
  if (c === "no") return "dot no";
  return "dot";
}

export default async function ServicesPage({
  params,
}: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.services;
  const href = (p: string) => localizedHref(p, lang);
  const products = await getAllProducts();

  return (
    <div className="page-services">
      <section className="page-hero">
        <div className="ornament-c"></div>
        <div className="container">
          <div>
            <h1>
              {t.hero.h1Pre}
              <br />
              {t.hero.h1Mid}
              <em>{t.hero.h1Em}</em>
            </h1>
          </div>
          <div className="right">
            <p>
              {t.hero.p1}{" "}
              <strong>{t.hero.p1Strong}</strong>
              {t.hero.p1Post}
            </p>
          </div>
        </div>
      </section>

      <div className="ia-bar">
        <div className="container">
          <div className="group">
            <h6>{t.iaBar.typeTitle}</h6>
            <span className="chip active">{t.iaBar.all}</span>
            {t.iaBar.typeChips.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
          <div className="group">
            <h6>{t.iaBar.materialTitle}</h6>
            {t.iaBar.materialChips.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
          <div className="group">
            <h6>{t.iaBar.channelTitle}</h6>
            {t.iaBar.channelChips.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="products">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow bar">{t.products.eyebrow}</div>
              <h2>{t.products.h2}</h2>
            </div>
          </div>
          <div className="product-grid">
            {products.map((p, i) => (
              <Link
                href={href(`/services/${p.slug}`)}
                className="product"
                key={p.slug}
              >
                <div className="product-visual photo">
                  {p.cover ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.cover} alt={p.name[lang]} loading="lazy" />
                  ) : (
                    <>
                      <div className="ph-grid"></div>
                      <div className="circle"></div>
                    </>
                  )}
                </div>
                <div className="product-body">
                  <div className="num">
                    {(i + 1).toString().padStart(2, "0")} / {products.length.toString().padStart(2, "0")}
                  </div>
                  <h3>{p.name[lang]}</h3>
                  <p>{p.blurb[lang]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="special-feat">
        <div className="ornament"></div>
        <div className="ornament2"></div>
        <div className="container">
          <div>
            <div className="eyebrow">{t.specialFeat.eyebrow}</div>
            <h2>
              {t.specialFeat.h2Line1}
              <br />
              <em>{t.specialFeat.h2Em}</em>
            </h2>
            <p>{t.specialFeat.p}</p>
            <div className="tag-line">
              {t.specialFeat.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="visual">
            <div className="para"></div>
            <div className="ph-grid"></div>
            <div className="circle"></div>
            <div className="tag">
              {t.specialFeat.tagLine1}
              <br />
              {t.specialFeat.tagLine2}
            </div>
          </div>
        </div>
      </section>

      <section className="matrix-band">
        <div className="container">
          <div className="head">
            <div>
              <div className="eyebrow bar">{t.matrix.eyebrow}</div>
              <h2>{t.matrix.h2}</h2>
            </div>
            <p>
              {t.matrix.pPre} <strong>{t.matrix.pStrong}</strong>
              {t.matrix.pPost}
            </p>
          </div>
          <div className="matrix">
            <table>
              <thead>
                <tr>
                  {t.matrix.th.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.matrix.rows.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    {row.cells.map((c, i) => (
                      <td key={i}>
                        <span className={dotClass(c)}></span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="matrix-legend">
            {t.matrix.legend.map((l) => (
              <div key={l.label} className="item">
                <span className={l.cls}></span> {l.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cap-band">
        <div className="container">
          <div>
            <div className="eyebrow bar" style={{ marginBottom: 14 }}>
              {t.cap.eyebrow}
            </div>
            <h2>{t.cap.h2}</h2>
            <p>{t.cap.p}</p>
            <Link href={href("/about")} className="cta primary">
              {t.cap.ctaAbout}
            </Link>
          </div>
          <div className="cap-grid">
            {t.cap.items.map((c) => (
              <div key={c.n} className="c">
                <h5>{c.n}</h5>
                <h4>{c.h4}</h4>
                <p>{c.p}</p>
              </div>
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
