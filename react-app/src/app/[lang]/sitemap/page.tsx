import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localizedHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/sitemap">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.sitemap.metaTitle,
    description: dict.sitemap.metaDescription,
    path: "/sitemap",
  });
}

export default async function SitemapPage({
  params,
}: PageProps<"/[lang]/sitemap">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.sitemap;
  const href = (p: string) => localizedHref(p, lang);

  return (
    <div className="page-sitemap">
      <section className="cover">
        <div className="container">
        <div className="top">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo-horizontal-black.svg"
              alt="Production LTD"
              style={{ height: 26 }}
            />
            <h1>
              {t.top.h1Pre}
              <br />
              <em>{t.top.h1Em}</em>
            </h1>
          </div>
          <div>
            <p className="lede">
              {t.top.ledePre} <strong>{t.top.ledeStrong}</strong>{" "}
              {t.top.ledePost}
            </p>
            <div className="summary">
              {t.top.summary.map((s, i) => (
                <div key={i} className="s">
                  <div className="v">
                    {s.vHtml ? (
                      <span
                        dangerouslySetInnerHTML={{ __html: s.vHtml }}
                      />
                    ) : (
                      s.v
                    )}
                  </div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="group-head">
          <h3>{t.group1.title}</h3>
          <span className="count">{t.group1.count}</span>
        </div>
        <div className="page-grid">
          {t.group1.cards.map((c) => (
            <Link key={c.path} href={href(c.href)} className="page-card row-2">
              <div className="preview">
                <iframe src={href(c.href)} scrolling="no"></iframe>
                <div className="overlay"></div>
                <div className={c.badgeFeat ? "badge feat" : "badge"}>
                  {c.badge}
                </div>
              </div>
              <div className="info">
                <div className="left">
                  <div className="num">{c.num}</div>
                  <h4>{c.h4}</h4>
                  <p className="desc">{c.desc}</p>
                </div>
                <div className="right">
                  <div className="path">{c.path}</div>
                  <div className="arrow">→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="group-head">
          <h3>{t.group2.title}</h3>
          <span className="count">{t.group2.count}</span>
        </div>
        <div className="page-grid">
          {t.group2.cards.map((c) => (
            <Link
              key={c.path}
              href={href(c.href)}
              className="page-card row-2"
              style={c.wide ? { gridColumn: "span 4" } : undefined}
            >
              <div
                className="preview"
                style={c.wide ? { aspectRatio: "21/9" } : undefined}
              >
                <iframe src={href(c.href)} scrolling="no"></iframe>
                <div className="overlay"></div>
                <div className={c.badgeFeat ? "badge feat" : "badge"}>
                  {c.badge}
                </div>
              </div>
              <div className="info">
                <div className="left">
                  <div className="num">{c.num}</div>
                  <h4>{c.h4}</h4>
                  <p className="desc">{c.desc}</p>
                </div>
                <div className="right">
                  <div className="path">{c.path}</div>
                  <div className="arrow">→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="notes-card">
          <div className="eye">{t.notes.eye}</div>
          <h3>{t.notes.h3}</h3>
          <ul>
            {t.notes.items.map((it) => (
              <li key={it.h6}>
                <div className="dot"></div>
                <div>
                  <h6>{it.h6}</h6>
                  <p>{it.p}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="legal">{t.legal}</div>
      </div>
    </section>
    </div>
  );
}
