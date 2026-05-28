import type { Metadata } from "next";
import { Manrope, Roboto_Mono, Caveat } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimationsInit } from "@/components/AnimationsInit";
import { BackToTop } from "@/components/BackToTop";
import { CookieConsent } from "@/components/CookieConsent";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";
import { getDictionary } from "@/lib/dictionaries";
import {
  hasLocale,
  LOCALES,
  localizedHref,
  type Locale,
} from "@/lib/i18n";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  buildLanguageAlternates,
} from "@/lib/seo";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext", "greek"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const canonical = localizedHref("/", lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${dict.meta.siteTagline}`,
      template: `%s — ${SITE_NAME}`,
    },
    description: dict.meta.defaultDescription,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    generator: "Next.js",
    keywords: [
      "POP",
      "POS",
      "retail displays",
      "floor stands",
      "counter stands",
      "Greek manufacturer",
      "Production LTD",
      "Industrialized Craft",
      "Αχαρνές",
      "μεταξοτυπία",
      "POP/POS συστήματα",
    ],
    category: "manufacturing",
    icons: {
      icon: "/assets/favicon-transparent.png",
      apple: "/assets/favicon-transparent.png",
    },
    alternates: {
      canonical,
      languages: buildLanguageAlternates("/"),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: dict.meta.ogLocale,
      url: canonical,
      title: `${SITE_NAME} — ${dict.meta.siteTagline}`,
      description: dict.meta.defaultDescription,
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — ${dict.meta.siteTagline}`,
      description: dict.meta.defaultDescription,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <html
      lang={lang}
      className={`${manrope.variable} ${robotoMono.variable} ${caveat.variable}`}
    >
      <body>
        <OrganizationJsonLd />
        <Header locale={lang as Locale} nav={dict.nav} />
        {children}
        <Footer locale={lang as Locale} t={dict.footer} />
        <AnimationsInit />
        <BackToTop />
        <CookieConsent locale={lang as Locale} t={dict.cookieConsent} />
      </body>
    </html>
  );
}
