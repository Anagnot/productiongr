import Link from "next/link";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { localizedHref, type Locale } from "@/lib/i18n";

type FooterStrings = {
  tagline: string;
  catalog: {
    title: string;
    specialProjects: string;
    floorCounter: string;
    displaySystems: string;
    gondolaPallet: string;
    posAccessories: string;
  };
  company: {
    title: string;
    about: string;
    portfolio: string;
    contact: string;
    quote: string;
  };
  contact: {
    title: string;
    email: string;
    phone: string;
    address: string;
    sitemap: string;
  };
  follow: {
    title: string;
    instagram: string;
    linkedin: string;
  };
  legal: {
    copyright: string;
    privacy: string;
    cookies: string;
    cookieSettings: string;
  };
};

type Props = { locale: Locale; t: FooterStrings };

export function Footer({ locale, t }: Props) {
  const href = (path: string) => localizedHref(path, locale);

  return (
    <footer>
      <div className="container">
        <div>
          <div className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo-horizontal-white.svg"
              alt=""
              style={{ height: 26, marginBottom: 16 }}
            />
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 280, margin: 0 }}>
            {t.tagline}
          </p>
        </div>
        <div>
          <h6>{t.catalog.title}</h6>
          <Link href={href("/services")}>{t.catalog.specialProjects}</Link>
          <Link href={href("/services")}>{t.catalog.floorCounter}</Link>
          <Link href={href("/services")}>{t.catalog.displaySystems}</Link>
          <Link href={href("/services")}>{t.catalog.gondolaPallet}</Link>
          <Link href={href("/services")}>{t.catalog.posAccessories}</Link>
        </div>
        <div>
          <h6>{t.company.title}</h6>
          <Link href={href("/about")}>{t.company.about}</Link>
          <Link href={href("/portfolio")}>{t.company.portfolio}</Link>
          <Link href={href("/contact")}>{t.company.contact}</Link>
          <Link href={href("/quote")}>{t.company.quote}</Link>
        </div>
        <div>
          <h6>{t.contact.title}</h6>
          <Link href={href("/contact")}>{t.contact.email}</Link>
          <Link href={href("/contact")}>{t.contact.phone}</Link>
          <Link href={href("/contact")}>{t.contact.address}</Link>
          <Link href={href("/sitemap")}>{t.contact.sitemap}</Link>
        </div>
        <div>
          <h6>{t.follow.title}</h6>
          <a
            href="https://www.instagram.com/production.gr"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.follow.instagram}
          </a>
          <a
            href="https://www.linkedin.com/company/production-ltd/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.follow.linkedin}
          </a>
        </div>
      </div>
      <div className="container">
        <div className="legal">
          <span>{t.legal.copyright}</span>
          <span className="legal-links">
            <Link href={href("/privacy")}>{t.legal.privacy}</Link>
            <span aria-hidden="true"> · </span>
            <Link href={href("/cookies")}>{t.legal.cookies}</Link>
            <span aria-hidden="true"> · </span>
            <CookieSettingsButton className="legal-link-btn">
              {t.legal.cookieSettings}
            </CookieSettingsButton>
          </span>
        </div>
      </div>
    </footer>
  );
}
