import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { ContactForm } from "./ContactForm";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localizedHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import "@/styles/pages/contact.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    path: "/contact",
    keywords: dict.contact.metaKeywords,
  });
}

export default async function ContactPage({
  params,
}: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.contact;
  const href = (p: string) => localizedHref(p, lang);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>
            {t.hero.h1Line1}
            <br />
            <em>{t.hero.h1Em}</em>
          </h1>
          <p className="lede">{t.hero.lede}</p>
        </div>
      </section>

      <section className="contact-grid">
        <div className="container">
          <div className="info-stack">
            <div className="info-card">
              <div className="glyph">{t.info.email.glyph}</div>
              <div>
                <h6>{t.info.email.h6}</h6>
                <div className="v">
                  <a href="mailto:info@production.gr">info@production.gr</a>
                </div>
                <div className="meta">{t.info.email.meta}</div>
                <div className="actions">
                  {t.info.email.actions.map((a) => (
                    <a key={a.label} href={a.href}>
                      {a.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="info-card">
              <div className="glyph">{t.info.phone.glyph}</div>
              <div>
                <h6>{t.info.phone.h6}</h6>
                <div className="v">
                  <a href="tel:+302102322750">{t.info.phone.value}</a>
                </div>
                <div className="meta">{t.info.phone.meta}</div>
              </div>
            </div>
            <div className="info-card">
              <div className="glyph" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div>
                <h6>{t.info.address.h6}</h6>
                <div className="v">
                  {t.info.address.line1}
                  <br />
                  {t.info.address.line2}
                </div>
                <div className="meta">{t.info.address.meta}</div>
                <div className="actions">
                  {t.info.address.actions.map((a, i) => (
                    <a
                      key={a.label}
                      href={
                        i === 0
                          ? "https://www.google.com/maps/search/?api=1&query=Τσαμαλή+63+Αχαρναί+13671"
                          : href("/contact")
                      }
                      target={i === 0 ? "_blank" : undefined}
                      rel={i === 0 ? "noopener noreferrer" : undefined}
                    >
                      {a.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="info-card">
              <div className="glyph">{t.info.hours.glyph}</div>
              <div>
                <h6>{t.info.hours.h6}</h6>
                <div className="v">{t.info.hours.value}</div>
                <div className="meta">{t.info.hours.meta}</div>
              </div>
            </div>
          </div>

          <ContactForm quoteHref={href("/quote")} t={t.form} />
        </div>
      </section>

      <section className="map-band">
        <div className="container">
          <div className="map-frame">
            <div className="map-bg"></div>
            <div className="map-roads">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                <path
                  d="M0,12 Q30,8 55,16 T100,18"
                  stroke="#bdbdbd"
                  strokeWidth="0.35"
                  fill="none"
                />
                <path
                  d="M0,28 Q25,32 50,26 T100,30"
                  stroke="#bdbdbd"
                  strokeWidth="0.3"
                  fill="none"
                />
                <path
                  d="M20,0 L24,40"
                  stroke="#dadada"
                  strokeWidth="0.25"
                  fill="none"
                />
                <path
                  d="M68,0 L72,40"
                  stroke="#dadada"
                  strokeWidth="0.25"
                  fill="none"
                />
                <path
                  d="M40,0 Q44,15 52,20 T56,40"
                  stroke="#E65C00"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.6"
                />
                <circle cx="34" cy="14" r="0.8" fill="#8a8a8a" />
                <circle cx="78" cy="22" r="0.8" fill="#8a8a8a" />
              </svg>
            </div>
            <div className="pin">
              <div className="label">{t.map.pinLabel}</div>
              <div className="marker">
                <div className="ripple"></div>
              </div>
            </div>
            <div className="corner">{t.map.corner1}</div>
            <div className="corner r">{t.map.corner2}</div>
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
        ctaLabel={t.ctaLabel}
      />
    </>
  );
}
