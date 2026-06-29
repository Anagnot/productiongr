import { SITE_NAME, SITE_URL } from "@/lib/seo";

/**
 * Site-wide identity graph, injected once in the root layout. Consolidates
 * Organization + LocalBusiness (physical facility, hours, contact) and the
 * WebSite node so detail-page schema can reference #organization by @id.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: "Production LTD",
        url: SITE_URL,
        logo: `${SITE_URL}/assets/logo-horizontal-black.svg`,
        image: `${SITE_URL}/assets/favicon-background.png`,
        foundingDate: "2008",
        slogan: "Crafting Retail Conversion",
        description:
          "Industrialized Craft — λύσεις προβολής & branded environments για retail.",
        telephone: "+30-210-232-2750",
        email: "info@production.gr",
        priceRange: "$$$",
        areaServed: { "@type": "Country", name: "Greece" },
        knowsLanguage: ["el", "en"],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Τσαμαλή 63",
          addressLocality: "Αχαρναί",
          addressRegion: "Αττική",
          postalCode: "13671",
          addressCountry: "GR",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+30-210-232-2750",
          email: "info@production.gr",
          contactType: "customer service",
          areaServed: "GR",
          availableLanguage: ["el", "en"],
        },
        sameAs: [
          "https://www.instagram.com/production.gr",
          "https://www.linkedin.com/company/production-ltd/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: ["el", "en"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
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
