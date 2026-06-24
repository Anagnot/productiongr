import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localizedHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

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
}: PageProps<"/[lang]/sustainability">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.sustainability.metaTitle,
    description: dict.sustainability.metaDescription,
    path: "/sustainability",
    keywords: dict.sustainability.metaKeywords,
  });
}

export default async function SustainabilityPage({
  params,
}: PageProps<"/[lang]/sustainability">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.home.sustain;
  const href = (p: string) => localizedHref(p, lang);

  return (
    <div className="page-sustainability">
      <section className="sustain">
        <div className="container">
          <h1>{t.h2}</h1>
          <p className="sustain-lede">{t.p}</p>
          <div className="sustain-pillars">
            {t.pillars.map((p) => (
              <div key={p.h6} className="s-card">
                <div className="s-num">{p.n}</div>
                <div className="s-sub">{p.sub}</div>
                <h6>{p.h6}</h6>
                <p>{p.p}</p>
              </div>
            ))}
          </div>
          <div className="certs-title">{t.certsTitle}</div>
          <div className="certs-row">
            {t.certsItems.map((c, i) => (
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
              {t.ctaProject}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
