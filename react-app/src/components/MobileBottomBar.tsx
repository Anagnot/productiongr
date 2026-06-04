import Link from "next/link";
import { localizedHref, type Locale } from "@/lib/i18n";

const PHONE_HREF = "tel:+302102322750";

type Props = {
  locale: Locale;
  callLabel: string;
  briefLabel: string;
  ariaLabel: string;
};

export function MobileBottomBar({
  locale,
  callLabel,
  briefLabel,
  ariaLabel,
}: Props) {
  return (
    <nav className="mobile-bottom-bar" aria-label={ariaLabel}>
      <a href={PHONE_HREF} className="mbb-btn mbb-call">
        <span aria-hidden="true">📞</span> {callLabel}
      </a>
      <Link
        href={localizedHref("/quote", locale)}
        className="mbb-btn mbb-brief"
      >
        {briefLabel}
      </Link>
    </nav>
  );
}
