import type { Locale } from "./i18n";

export type CatalogDetails = {
  intro: Record<Locale, string[]>;
  highlights: Record<Locale, string[]>;
};

/** Build-type materials — drives the material pills on product cards & detail pages. */
export type MaterialKey = "paper" | "metal" | "plastic" | "wood" | "plexi" | "premium";

export type CatalogEntry = {
  slug: string;
  name: Record<Locale, string>;
  blurb: Record<Locale, string>;
  /** Show in Header dropdown + /channels grid. Omit/false = SEO-only (page still builds). */
  inMenu?: boolean;
  /** Show in the homepage channels strip (curated subset). */
  featured?: boolean;
  /** Short bullet list — used by channels that have no full `details`. */
  bullets?: Record<Locale, string[]>;
  /** Materials this build type is made in (products only). */
  materials?: MaterialKey[];
  /** Channel slugs that use this build type — drives Channels↔Products cross-links (products only). */
  channels?: string[];
  details?: CatalogDetails;
};

export const PRODUCTS: CatalogEntry[] = [
  {
    slug: "counter-stands",
    name: { el: "Counter Stands", en: "Counter Stands" },
    blurb: {
      el: "Compact επιτραπέζια displays για ταμεία, βιτρίνες και σημεία impulse. Premium MDF & plexi για cosmetics / pharma ή mass-production volume.",
      en: "Compact countertop displays for cash registers, vitrines and impulse points. Premium MDF & plexi for cosmetics / pharma or mass-production volume.",
    },
    materials: ["paper", "metal", "plastic", "wood", "plexi"],
    channels: ["retail-beauty", "pharma", "kiosk", "horeca", "super-market"],
  },
  {
    slug: "displays",
    name: { el: "Display Systems", en: "Display Systems" },
    blurb: {
      el: "Συστήματα προβολής για προϊοντική ανάδειξη — από bottle presenters έως πολυεπίπεδα retail concepts.",
      en: "Product showcasing systems — from bottle presenters to multi-tier retail concepts.",
    },
    materials: ["plastic", "wood", "plexi", "premium"],
    channels: ["retail-beauty", "pharma", "super-market", "exhibitions"],
  },
  {
    slug: "floor-stands",
    name: { el: "Floor Stands", en: "Floor Stands" },
    blurb: {
      el: "Aisle-end & freestanding units. Χαρτί, μέταλλο, ξύλο, πλαστικό, plexiglass — από flat-pack seasonal σε μόνιμες βιομηχανικές κατασκευές.",
      en: "Aisle-end & freestanding units. Paper, metal, wood, plastic, plexiglass — from flat-pack seasonal to permanent industrial builds.",
    },
    materials: ["paper", "metal", "plastic", "wood", "plexi", "premium"],
    channels: ["super-market", "retail-beauty", "pharma", "horeca", "kiosk", "exhibitions", "events"],
  },
  {
    slug: "pallet-stands",
    name: { el: "Pallet Stands", en: "Pallet Stands" },
    blurb: {
      el: "Full pallet, half pallet & mini lobby. Υψηλή φέρουσα ικανότητα, γρήγορη συναρμολόγηση, πλήρως brand-customized.",
      en: "Full pallet, half pallet & mini lobby. High load capacity, fast assembly, fully brand-customized.",
    },
    materials: ["paper", "metal", "premium"],
    channels: ["super-market", "exhibitions", "events"],
  },
  {
    slug: "promo-constructions",
    name: { el: "Promo Constructions", en: "Promo Constructions" },
    blurb: {
      el: "Custom κατασκευές για in-store activations, shop-in-shop concepts και portable promo setups.",
      en: "Custom constructions for in-store activations, shop-in-shop concepts and portable promo setups.",
    },
    materials: ["paper", "metal", "plastic", "plexi"],
    channels: ["exhibitions", "events", "super-market"],
  },
  {
    slug: "shelves",
    name: { el: "Shelves", en: "Shelves" },
    blurb: {
      el: "Gondola ends, ραφιέρες και shelf solutions για συστηματικό category management.",
      en: "Gondola ends, shelving and shelf solutions for systematic category management.",
    },
    materials: ["metal", "wood", "premium"],
    channels: ["super-market", "pharma"],
  },
  {
    slug: "wall-units",
    name: { el: "Wall Units", en: "Wall Units" },
    blurb: {
      el: "Επίτοιχα συστήματα προβολής — modular, σταθερές βάσεις, premium finishes για flagship stores και brand corners.",
      en: "Wall-mounted display systems — modular, fixed bases, premium finishes for flagship stores and brand corners.",
    },
    materials: ["metal", "wood", "plexi", "premium"],
    channels: ["retail-beauty", "pharma", "super-market"],
  },
];

export const CHANNELS: CatalogEntry[] = [
  {
    slug: "super-market",
    name: { el: "Super Markets", en: "Super Markets" },
    inMenu: true,
    featured: true,
    blurb: {
      el: "End-caps, pallet stands, shelf trays και seasonal activations για το πιο απαιτητικό retail κανάλι.",
      en: "End-caps, pallet stands, shelf trays and seasonal activations for the most demanding retail channel.",
    },
    details: {
      intro: {
        el: [
          "Το super market είναι το πιο απαιτητικό retail κανάλι — υψηλό traffic, αυστηρά specs, μεγάλο volume.",
          "Σχεδιάζουμε end-caps, pallet stands, shelf trays και seasonal activations που αντέχουν τη χρήση και κρατούν τη brand εικόνα αδιάλειπτη.",
        ],
        en: [
          "The super market is the most demanding retail channel — high traffic, strict specs, large volume.",
          "We design end-caps, pallet stands, shelf trays and seasonal activations that withstand use and keep the brand image consistent.",
        ],
      },
      highlights: {
        el: [
          "End-caps & pallet stands υψηλής φέρουσας",
          "Shelf trays για κατηγοριακό category management",
          "Seasonal activations με flat-pack logistics",
          "Συμμόρφωση με retailer specs",
        ],
        en: [
          "High-load end-caps & pallet stands",
          "Shelf trays for category management",
          "Seasonal activations with flat-pack logistics",
          "Compliance with retailer specs",
        ],
      },
    },
  },
  {
    slug: "retail-beauty",
    name: { el: "Retail & Beauty", en: "Retail & Beauty" },
    inMenu: true,
    featured: true,
    blurb: {
      el: "Premium displays για καλλυντικά, beauty και design-led retail — vitrines, brand corners και counter units με finishing που πουλάει.",
      en: "Premium displays for cosmetics, beauty and design-led retail — vitrines, brand corners and counter units with finishing that sells.",
    },
    details: {
      intro: {
        el: [
          "Σχεδιάζουμε και κατασκευάζουμε premium displays για καλλυντικά, beauty και design-led retail, με έμφαση στο finishing και την αισθητική του brand.",
          "Από counter vitrines μέχρι ολόκληρα brand corners, κάθε κατασκευή σχεδιάζεται για να αναδείξει την πρόταση του προϊόντος και να ενισχύσει την εμπειρία αγοράς.",
        ],
        en: [
          "We design and manufacture premium displays for cosmetics, beauty and design-led retail, with a focus on finishing and brand aesthetics.",
          "From counter vitrines to full brand corners, every build is engineered to elevate the product story and enhance the in-store experience.",
        ],
      },
      highlights: {
        el: [
          "Premium υλικά: MDF, plexi, μέταλλο με υψηλής ποιότητας φινίρισμα",
          "Φωτισμός LED integration για ανάδειξη προϊόντων",
          "Brand-consistent χρωματικές και τυπογραφικές παλέτες",
          "Modular σχεδιασμός για ευέλικτη ανανέωση layout",
        ],
        en: [
          "Premium materials: MDF, plexi, metal with high-end finishing",
          "Integrated LED lighting to highlight product",
          "Brand-consistent color and typography palettes",
          "Modular design for flexible layout refreshes",
        ],
      },
    },
  },
  {
    slug: "pharma",
    name: { el: "Pharmacy", en: "Pharmacy" },
    inMenu: true,
    featured: true,
    blurb: {
      el: "Counter & floor displays για φαρμακεία — premium materials, regulatory-friendly finishing, brand-consistent storytelling.",
      en: "Counter & floor displays for pharmacies — premium materials, regulatory-friendly finishing, brand-consistent storytelling.",
    },
    details: {
      intro: {
        el: [
          "Για το φαρμακείο σχεδιάζουμε counter & floor displays που μεταφέρουν εμπιστοσύνη, καθαριότητα και επαγγελματισμό.",
          "Με premium υλικά, regulatory-friendly finishing και brand-consistent storytelling, οι κατασκευές μας στηρίζουν την ανάδειξη OTC και dermocosmetic προϊόντων.",
        ],
        en: [
          "For the pharmacy we design counter & floor displays that convey trust, cleanliness and professionalism.",
          "With premium materials, regulatory-friendly finishing and brand-consistent storytelling, our builds support the presentation of OTC and dermocosmetic ranges.",
        ],
      },
      highlights: {
        el: [
          "Counter & floor displays σε premium MDF/plexi",
          "Regulatory-friendly finishing",
          "Καθαρές γραμμές & ergonomics για το προσωπικό",
          "Brand-consistent storytelling για OTC/dermocosmetics",
        ],
        en: [
          "Counter & floor displays in premium MDF/plexi",
          "Regulatory-friendly finishing",
          "Clean lines & ergonomics for staff",
          "Brand-consistent storytelling for OTC/dermocosmetics",
        ],
      },
    },
  },
  {
    slug: "horeca",
    name: { el: "HORECA", en: "HORECA" },
    inMenu: true,
    featured: true,
    blurb: {
      el: "Menu holders, outdoor signage, table organizers, promo stands και hospitality signage για εστιατόρια, μπαρ και ξενοδοχεία.",
      en: "Menu holders, outdoor signage, table organizers, promo stands and hospitality signage for restaurants, bars and hotels.",
    },
    details: {
      intro: {
        el: [
          "Σχεδιάζουμε λύσεις προβολής για το HORECA που συνδυάζουν λειτουργικότητα με αισθητική του χώρου.",
          "Από outdoor signage και menu holders μέχρι table organizers, bar displays και hospitality signage για lobby ξενοδοχείων — κάθε λεπτομέρεια εναρμονίζεται με το brand identity του εστιατορίου, μπαρ ή ξενοδοχείου.",
        ],
        en: [
          "We design HORECA display solutions that combine functionality with venue aesthetics.",
          "From outdoor signage and menu holders to table organizers, bar displays and hospitality signage for hotel lobbies — every detail is tuned to the brand identity of the restaurant, bar or hotel.",
        ],
      },
      highlights: {
        el: [
          "Outdoor signage σε ανθεκτικά υλικά",
          "Menu holders & table organizers σε premium φινίρισμα",
          "Hospitality signage & displays για lobby ξενοδοχείων",
          "Custom brand-customized υλικά και χρώματα",
        ],
        en: [
          "Outdoor signage in durable materials",
          "Menu holders & table organizers in premium finishing",
          "Hospitality signage & hotel lobby displays",
          "Custom brand-customized materials and colors",
        ],
      },
    },
  },
  {
    slug: "kiosk",
    name: { el: "Kiosk & Convenience", en: "Kiosk & Convenience" },
    inMenu: true,
    featured: true,
    blurb: {
      el: "Counter-trays, cash-tray packs, hanging units και compact displays — μέγιστη ορατότητα και impulse σε ελάχιστο χώρο.",
      en: "Counter-trays, cash-tray packs, hanging units and compact displays — maximum visibility and impulse capture in minimal space.",
    },
    details: {
      intro: {
        el: [
          "Το kiosk και το convenience store είναι από τα πιο απαιτητικά retail σημεία — λίγος χώρος, υψηλό traffic, μηδενική ανοχή σε σχεδιαστικά λάθη.",
          "Σχεδιάζουμε counter-trays, cash-tray packs, hanging units και compact displays που μεγιστοποιούν την ορατότητα του brand στο σημείο impulse purchase.",
        ],
        en: [
          "The kiosk and the convenience store are among the most demanding retail points — tight space, high traffic, zero tolerance for design mistakes.",
          "We design counter-trays, cash-tray packs, hanging units and compact displays that maximize brand visibility at the impulse purchase point.",
        ],
      },
      highlights: {
        el: [
          "Counter-trays & cash-tray packs",
          "Hanging units & compact displays για μέγιστη ορατότητα",
          "Ανθεκτικά υλικά για συνεχόμενο restocking",
          "Γρήγορη παραγωγή & επανατοποθέτηση",
        ],
        en: [
          "Counter-trays & cash-tray packs",
          "Hanging units & compact displays for maximum visibility",
          "Durable materials for continuous restocking",
          "Fast production & redeployment",
        ],
      },
    },
  },
  {
    slug: "exhibitions",
    name: { el: "Εκθέσεις", en: "Exhibitions" },
    inMenu: true,
    featured: true,
    blurb: {
      el: "Εκθεσιακά booths, branded περιβάλλοντα και εγκαταστάσεις εκθέσεων — σχεδιασμένα για μέγιστο brand impact σε ελάχιστο χρόνο setup.",
      en: "Exhibition booths, branded environments and trade show installations — engineered for maximum brand impact in minimal setup time.",
    },
    bullets: {
      el: [
        "Custom σχεδιασμός booth",
        "Modular & επαναχρησιμοποιήσιμες κατασκευές",
        "Brand-consistent γραφικά",
        "On-site εγκατάσταση & αποξήλωση",
      ],
      en: [
        "Custom booth design",
        "Modular & reusable structures",
        "Brand-consistent graphics",
        "On-site installation & dismantling",
      ],
    },
  },
  {
    slug: "events",
    name: { el: "Events", en: "Events" },
    inMenu: true,
    featured: true,
    blurb: {
      el: "Setups για product launches, pop-up stores, in-store activations και promotional κατασκευές — από την ιδέα ως την εγκατάσταση.",
      en: "Product launch setups, pop-up stores, in-store activations and promotional constructions — from concept to installation.",
    },
    bullets: {
      el: [
        "Displays για product launches",
        "Περιβάλλοντα pop-up store",
        "In-store brand activations",
        "Seasonal promotional setups",
      ],
      en: [
        "Product launch displays",
        "Pop-up store environments",
        "In-store brand activations",
        "Seasonal promotional setups",
      ],
    },
  },
  {
    slug: "hairdresser",
    name: { el: "Hairdresser", en: "Hairdresser" },
    inMenu: false,
    featured: false,
    blurb: {
      el: "Professional product displays για κομμωτήρια — wall units, vitrines και retail σημεία.",
      en: "Professional product displays for hair salons — wall units, vitrines and retail points.",
    },
    details: {
      intro: {
        el: [
          "Στα κομμωτήρια το display δεν είναι απλώς ράφι — είναι μέρος της εμπειρίας του πελάτη. Σχεδιάζουμε wall units, vitrines και brand corners που μετατρέπουν τα professional προϊόντα περιποίησης σε retail προτεραιότητα.",
          "Συνεργαζόμαστε με brands και αλυσίδες salons για να παραδίδουμε κατασκευές με premium φινίρισμα, ενσωματωμένο φωτισμό και ευέλικτο σχεδιασμό που προσαρμόζεται στις διαστάσεις του χώρου.",
          "Από το concept μέχρι το installation, αναλαμβάνουμε όλη τη διαδικασία — μηχανολογικός σχεδιασμός, παραγωγή στις εγκαταστάσεις μας στις Αχαρνές, on-site συναρμολόγηση.",
        ],
        en: [
          "In a hair salon the display isn't just a shelf — it's part of the customer experience. We design wall units, vitrines and brand corners that turn professional haircare into a retail priority.",
          "We work with brands and salon chains to deliver builds with premium finishing, integrated lighting and a flexible design that adapts to room dimensions.",
          "From concept to installation we handle the full pipeline — engineering, in-house production at our Acharnes facility, on-site assembly.",
        ],
      },
      highlights: {
        el: [
          "Wall units & vitrines με ενσωματωμένο LED lighting",
          "Premium υλικά: MDF, plexi, μέταλλο, ξύλο",
          "Modular layouts προσαρμοσμένα στο salon footprint",
          "Brand-customized finishing και τυπογραφία",
        ],
        en: [
          "Wall units & vitrines with integrated LED lighting",
          "Premium materials: MDF, plexi, metal, wood",
          "Modular layouts adapted to the salon footprint",
          "Brand-customized finishing and typography",
        ],
      },
    },
  },
  {
    slug: "toy-stores",
    name: { el: "Toy Stores", en: "Toy Stores" },
    inMenu: false,
    featured: false,
    blurb: {
      el: "Colorful, kid-friendly displays — shelf units, themed end-caps και interactive brand zones.",
      en: "Colorful, kid-friendly displays — shelf units, themed end-caps and interactive brand zones.",
    },
    details: {
      intro: {
        el: [
          "Στα toy stores ο σχεδιασμός είναι παιχνίδι — αλλά με κανόνες ασφάλειας και αντοχής.",
          "Δημιουργούμε colorful, kid-friendly displays, themed end-caps και interactive brand zones που τραβούν τα παιδιά και πείθουν τους γονείς.",
        ],
        en: [
          "In toy stores design is play — but with safety and durability rules.",
          "We create colorful, kid-friendly displays, themed end-caps and interactive brand zones that attract kids and convince parents.",
        ],
      },
      highlights: {
        el: [
          "Kid-friendly, ασφαλή υλικά & finishing",
          "Themed end-caps για IP-driven campaigns",
          "Interactive brand zones",
          "Ζωντανές παλέτες & τυπογραφία",
        ],
        en: [
          "Kid-friendly, safe materials & finishing",
          "Themed end-caps for IP-driven campaigns",
          "Interactive brand zones",
          "Vivid palettes & typography",
        ],
      },
    },
  },
];
