import type { Locale } from "./i18n";

export type CatalogDetails = {
  intro: Record<Locale, string[]>;
  highlights: Record<Locale, string[]>;
};

export type CatalogEntry = {
  slug: string;
  name: Record<Locale, string>;
  blurb: Record<Locale, string>;
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
  },
  {
    slug: "displays",
    name: { el: "Display Systems", en: "Display Systems" },
    blurb: {
      el: "Συστήματα προβολής για προϊοντική ανάδειξη — από bottle presenters έως πολυεπίπεδα retail concepts.",
      en: "Product showcasing systems — from bottle presenters to multi-tier retail concepts.",
    },
  },
  {
    slug: "floor-stands",
    name: { el: "Floor Stands", en: "Floor Stands" },
    blurb: {
      el: "Aisle-end & freestanding units. Χαρτί, μέταλλο, ξύλο, πλαστικό, plexiglass — από flat-pack seasonal σε μόνιμες βιομηχανικές κατασκευές.",
      en: "Aisle-end & freestanding units. Paper, metal, wood, plastic, plexiglass — from flat-pack seasonal to permanent industrial builds.",
    },
  },
  {
    slug: "pallet-stands",
    name: { el: "Pallet Stands", en: "Pallet Stands" },
    blurb: {
      el: "Full pallet, half pallet & mini lobby. Υψηλή φέρουσα ικανότητα, γρήγορη συναρμολόγηση, πλήρως brand-customized.",
      en: "Full pallet, half pallet & mini lobby. High load capacity, fast assembly, fully brand-customized.",
    },
  },
  {
    slug: "promo-constructions",
    name: { el: "Promo Constructions", en: "Promo Constructions" },
    blurb: {
      el: "Custom κατασκευές για in-store activations, shop-in-shop concepts και portable promo setups.",
      en: "Custom constructions for in-store activations, shop-in-shop concepts and portable promo setups.",
    },
  },
  {
    slug: "shelves",
    name: { el: "Shelves", en: "Shelves" },
    blurb: {
      el: "Gondola ends, ραφιέρες και shelf solutions για συστηματικό category management.",
      en: "Gondola ends, shelving and shelf solutions for systematic category management.",
    },
  },
  {
    slug: "wall-units",
    name: { el: "Wall Units", en: "Wall Units" },
    blurb: {
      el: "Επίτοιχα συστήματα προβολής — modular, σταθερές βάσεις, premium finishes για flagship stores και brand corners.",
      en: "Wall-mounted display systems — modular, fixed bases, premium finishes for flagship stores and brand corners.",
    },
  },
];

export const CHANNELS: CatalogEntry[] = [
  {
    slug: "beauty-shop",
    name: { el: "Beauty Shops", en: "Beauty Shops" },
    blurb: {
      el: "Premium displays για καλλυντικά & beauty — vitrines, counter units και brand corners με προσοχή στο finishing.",
      en: "Premium displays for cosmetics & beauty — vitrines, counter units and brand corners with attention to finishing.",
    },
    details: {
      intro: {
        el: [
          "Σχεδιάζουμε και κατασκευάζουμε premium displays για beauty shops με έμφαση στο finishing και την αισθητική του brand.",
          "Από counter vitrines μέχρι ολόκληρα brand corners, κάθε κατασκευή σχεδιάζεται για να αναδείξει την πρόταση του προϊόντος και να ενισχύσει την εμπειρία αγοράς.",
        ],
        en: [
          "We design and manufacture premium displays for beauty shops with a focus on finishing and brand aesthetics.",
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
    slug: "convenience-stores",
    name: { el: "Convenience Stores", en: "Convenience Stores" },
    blurb: {
      el: "Compact stands, hanging units και POS λύσεις για υψηλό traffic και περιορισμένο footprint.",
      en: "Compact stands, hanging units and POS solutions for high traffic and limited footprint.",
    },
    details: {
      intro: {
        el: [
          "Για convenience stores σχεδιάζουμε λύσεις που μεγιστοποιούν την προβολή σε ελάχιστο χώρο, σε περιβάλλον υψηλού traffic.",
          "Counter trays, hanging displays και compact end-caps — κατασκευές που αντέχουν την καθημερινή χρήση και κρατούν το brand σε first-line θέση.",
        ],
        en: [
          "For convenience stores we design solutions that maximize exposure in minimal space, in a high-traffic environment.",
          "Counter trays, hanging displays and compact end-caps — builds that withstand daily use and keep the brand front of line.",
        ],
      },
      highlights: {
        el: [
          "Compact footprint, μέγιστη προϊοντική χωρητικότητα",
          "Hanging units & counter trays για impulse points",
          "Ανθεκτικά υλικά για συνεχόμενο restocking",
          "Γρήγορη συναρμολόγηση on-site",
        ],
        en: [
          "Compact footprint, maximum product capacity",
          "Hanging units & counter trays for impulse points",
          "Durable materials for continuous restocking",
          "Fast on-site assembly",
        ],
      },
    },
  },
  {
    slug: "hairdresser",
    name: { el: "Hairdresser", en: "Hairdresser" },
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
    slug: "horeca",
    name: { el: "HoReCa", en: "HoReCa" },
    blurb: {
      el: "Menu holders, outdoor signage, table organizers και promo stands για εστιατόρια, μπαρ και ξενοδοχεία.",
      en: "Menu holders, outdoor signage, table organizers and promo stands for restaurants, bars and hotels.",
    },
    details: {
      intro: {
        el: [
          "Σχεδιάζουμε λύσεις προβολής για το HoReCa που συνδυάζουν λειτουργικότητα με αισθητική του χώρου.",
          "Από outdoor signage και menu holders μέχρι table organizers και bar displays — κάθε λεπτομέρεια εναρμονίζεται με το brand identity του εστιατορίου, μπαρ ή ξενοδοχείου.",
        ],
        en: [
          "We design HoReCa display solutions that combine functionality with venue aesthetics.",
          "From outdoor signage and menu holders to table organizers and bar displays — every detail is tuned to the brand identity of the restaurant, bar or hotel.",
        ],
      },
      highlights: {
        el: [
          "Outdoor signage σε ανθεκτικά υλικά",
          "Menu holders & table organizers σε premium φινίρισμα",
          "Bar & hotel lobby promo stands",
          "Custom brand-customized υλικά και χρώματα",
        ],
        en: [
          "Outdoor signage in durable materials",
          "Menu holders & table organizers in premium finishing",
          "Bar & hotel lobby promo stands",
          "Custom brand-customized materials and colors",
        ],
      },
    },
  },
  {
    slug: "kiosk",
    name: { el: "Kiosk", en: "Kiosk" },
    blurb: {
      el: "Counter-trays, cash-tray packs και impulse displays — μέγιστη ορατότητα σε ελάχιστο χώρο.",
      en: "Counter trays, cash-tray packs and impulse displays — maximum visibility in minimal space.",
    },
    details: {
      intro: {
        el: [
          "Το kiosk είναι από τα πιο απαιτητικά retail σημεία — λίγος χώρος, υψηλό traffic, μηδενική ανοχή σε σχεδιαστικά λάθη.",
          "Σχεδιάζουμε counter-trays, cash-tray packs και compact displays που μεγιστοποιούν την ορατότητα του brand σε σημείο impulse purchase.",
        ],
        en: [
          "The kiosk is one of the most demanding retail points — tight space, high traffic, zero tolerance for design mistakes.",
          "We design counter-trays, cash-tray packs and compact displays that maximize brand visibility at the impulse purchase point.",
        ],
      },
      highlights: {
        el: [
          "Counter-trays & cash-tray packs",
          "Compact displays για μέγιστη ορατότητα",
          "Materials ανθεκτικά σε καθημερινή χρήση",
          "Γρήγορη παραγωγή & επανατοποθέτηση",
        ],
        en: [
          "Counter-trays & cash-tray packs",
          "Compact displays for maximum visibility",
          "Materials built for daily use",
          "Fast production & redeployment",
        ],
      },
    },
  },
  {
    slug: "pharma",
    name: { el: "Pharmacy", en: "Pharmacy" },
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
    slug: "super-market",
    name: { el: "Super Market", en: "Super Market" },
    blurb: {
      el: "End-caps, pallet stands, shelf trays και seasonal activations για το πιο απαιτητικό POP κανάλι.",
      en: "End-caps, pallet stands, shelf trays and seasonal activations for the most demanding POP channel.",
    },
    details: {
      intro: {
        el: [
          "Το super market είναι το πιο απαιτητικό POP κανάλι — υψηλό traffic, αυστηρά specs, μεγάλο volume.",
          "Σχεδιάζουμε end-caps, pallet stands, shelf trays και seasonal activations που αντέχουν τη χρήση και κρατούν τη brand εικόνα αδιάλειπτη.",
        ],
        en: [
          "The super market is the most demanding POP channel — high traffic, strict specs, large volume.",
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
    slug: "toy-stores",
    name: { el: "Toy Stores", en: "Toy Stores" },
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
