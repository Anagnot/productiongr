import { SITE_NAME, SITE_URL } from "@/lib/seo";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "Production LTD",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo-horizontal-black.svg`,
    foundingDate: "2008",
    slogan: "Crafting Retail Conversion",
    description:
      "Industrialized Craft — POP/POS συστήματα και ολοκληρωμένες λύσεις προβολής για retail.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Τσαμαλή 63",
      addressLocality: "Αχαρναί",
      addressRegion: "Αττική",
      postalCode: "13671",
      addressCountry: "GR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+30-210-232-2750",
      email: "info@production.gr",
      contactType: "customer service",
      areaServed: "GR",
      availableLanguage: ["el", "en"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
    },
    sameAs: [
      "https://www.instagram.com/production.gr",
      "https://www.linkedin.com/company/production-ltd/",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
