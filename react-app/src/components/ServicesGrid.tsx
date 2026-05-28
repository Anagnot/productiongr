import Link from "next/link";

export type ServiceItem = {
  num: string;
  title: string;
  desc: string;
  href: string;
};

export type ServicesFeatBig = {
  num: string;
  title: string;
  desc: string;
};

type Props = {
  featBig: ServicesFeatBig;
  featBigHref: string;
  items: ReadonlyArray<ServiceItem>;
  initialVisible?: number;
  allHref: string;
  allLabel: string;
};

export function ServicesGrid({
  featBig,
  featBigHref,
  items,
  initialVisible = 4,
  allHref,
  allLabel,
}: Props) {
  const visible = items.slice(0, initialVisible);

  return (
    <>
      <div className="services-grid home-services-grid">
        <Link href={featBigHref} className="service feat-big">
          <div className="arrow">→</div>
          <h3>{featBig.title}</h3>
          <div className="s-desc">{featBig.desc}</div>
        </Link>
        {visible.map((s) => (
          <Link key={s.num} href={s.href} className="service">
            <div className="arrow">→</div>
            <h3>{s.title}</h3>
            <div className="s-desc">{s.desc}</div>
          </Link>
        ))}
      </div>
      {items.length > initialVisible && (
        <div className="services-more">
          <Link href={allHref} className="cta outline">
            <span>{allLabel}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </>
  );
}
