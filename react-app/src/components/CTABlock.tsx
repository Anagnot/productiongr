import Link from "next/link";
import { localizedHref, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  title: React.ReactNode;
  ctaLabel: string;
  ctaHref?: string;
};

export function CTABlock({ locale, title, ctaLabel, ctaHref = "/quote" }: Props) {
  return (
    <section className="cta-block">
      <div className="ornament"></div>
      <div className="container">
        <h2>{title}</h2>
        <Link
          href={localizedHref(ctaHref, locale)}
          className="cta primary lg"
          style={{ background: "var(--color-orange)" }}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
