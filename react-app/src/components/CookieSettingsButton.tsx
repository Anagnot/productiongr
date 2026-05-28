"use client";

import { openCookieSettings } from "@/lib/cookie-consent";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function CookieSettingsButton({ children, className }: Props) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={className ?? "cookie-link-btn"}
    >
      {children}
    </button>
  );
}
