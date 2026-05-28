import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/cookies">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({
    locale: lang,
    title: dict.cookies.metaTitle,
    description: dict.cookies.metaDescription,
    path: "/cookies",
  });
}

export default async function CookiesPage({
  params,
}: PageProps<"/[lang]/cookies">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.cookies;

  return (
    <section className="page-hero legal-page">
      <div className="container" style={{ maxWidth: 820 }}>
        <h1>{t.h1}</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          {t.updated}
        </p>
        <p style={{ marginTop: 24, lineHeight: 1.7 }}>{t.intro}</p>

        <div className="cookie-table" style={{ marginTop: 32 }}>
          <table>
            <thead>
              <tr>
                {t.tableHeads.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.cat}</td>
                  <td>{r.desc}</td>
                  <td>{r.dur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>{t.manageTitle}</h2>
          <p style={{ lineHeight: 1.7, marginBottom: 16 }}>{t.manageText}</p>
          <CookieSettingsButton className="cta">
            {t.manageButton}
          </CookieSettingsButton>
        </div>
      </div>
    </section>
  );
}
