// Server component — a pure-CSS, seamless "trusted by" logo marquee.
// The track holds two identical copies of the list; the CSS animation shifts it
// by -50% so the loop is seamless. Hover pauses the scroll (see logo-marquee.css)
// and lifts each logo from grayscale to full colour. No client JS required.

const LOGOS: { slug: string; name: string }[] = [
  { slug: "pepsi", name: "Pepsi" },
  { slug: "colgate", name: "Colgate" },
  { slug: "bic", name: "BIC" },
  { slug: "lacta", name: "Lacta" },
  { slug: "amita", name: "Amita" },
  { slug: "altion", name: "Altion" },
  { slug: "bioten", name: "Bioten" },
  { slug: "gordons", name: "Gordon’s" },
  { slug: "trident", name: "Trident" },
  { slug: "nestle", name: "Nestlé" },
  { slug: "oreo", name: "Oreo" },
  { slug: "tsakiris", name: "Tsakiris" },
  { slug: "lays", name: "Lay’s" },
  { slug: "7days", name: "7Days" },
  { slug: "caprice", name: "Caprice" },
  { slug: "intermed", name: "InterMed" },
  { slug: "septona", name: "Septona" },
  { slug: "mentos", name: "Mentos" },
  { slug: "chupa-chups", name: "Chupa Chups" },
  { slug: "orbit", name: "Orbit" },
  { slug: "life", name: "Life" },
  { slug: "baileys", name: "Baileys" },
  { slug: "nobacco", name: "Nobacco" },
  { slug: "lipton", name: "Lipton" },
  { slug: "vikos-cola", name: "Vikos Cola" },
  { slug: "fix-hellas", name: "Fix Hellas" },
  { slug: "wella", name: "Wella" },
  { slug: "johnnie-walker", name: "Johnnie Walker" },
  { slug: "jumbo", name: "Jumbo" },
  { slug: "nicorette", name: "Nicorette" },
  { slug: "nurofen", name: "Nurofen" },
  { slug: "carroten", name: "Carroten" },
  { slug: "piz-buin", name: "Piz Buin" },
  { slug: "smirnoff", name: "Smirnoff" },
  { slug: "schweppes", name: "Schweppes" },
  { slug: "glo", name: "glo" },
  { slug: "mythos", name: "Mythos" },
  { slug: "depon", name: "Depon" },
  { slug: "neutrogena", name: "Neutrogena" },
  { slug: "tanqueray", name: "Tanqueray" },
  { slug: "coca-cola", name: "Coca-Cola" },
  { slug: "nivea", name: "Nivea" },
  { slug: "apivita", name: "Apivita" },
];

type Props = {
  title: string;
  /** Localised "logo of {brand}" template; "{brand}" is replaced per item. */
  logoAltTemplate: string;
};

export function LogoMarquee({ title, logoAltTemplate }: Props) {
  // Two copies back-to-back give the -50% loop its seamless wrap.
  const track = [...LOGOS, ...LOGOS];

  return (
    <section className="logo-marquee" aria-label={title}>
      <div className="container">
        <h2 className="logo-marquee-title">{title}</h2>
        <div className="logo-marquee-wrap">
          <ul className="logo-marquee-track">
            {track.map((logo, i) => (
              <li
                key={`${logo.slug}-${i}`}
                className="logo-marquee-item"
                aria-hidden={i >= LOGOS.length ? true : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/logos/${logo.slug}.png`}
                  alt={
                    i >= LOGOS.length
                      ? ""
                      : logoAltTemplate.replace("{brand}", logo.name)
                  }
                  loading="lazy"
                  draggable={false}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
