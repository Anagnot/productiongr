"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LOCALES,
  LOCALE_LABELS,
  localizedHref,
  stripLocale,
  type Locale,
} from "@/lib/i18n";

type Props = { locale: Locale };

export function LangSwitch({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function switchTo(target: Locale) {
    if (target === locale) {
      setOpen(false);
      return;
    }
    const { path } = stripLocale(pathname);
    router.push(localizedHref(path, target));
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={`lang-switch${open ? " open" : ""}`}>
      <button
        className="trigger"
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <span>{LOCALE_LABELS[locale].code}</span>
        <svg
          className="chev"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M1 1 L5 5 L9 1" />
        </svg>
      </button>
      <div className="menu" role="menu">
        {LOCALES.map((code) => (
          <a
            key={code}
            href={localizedHref(stripLocale(pathname).path, code)}
            role="menuitem"
            className={code === locale ? "active" : undefined}
            onClick={(e) => {
              e.preventDefault();
              switchTo(code);
            }}
          >
            <span className={`flag ${code}`}></span>
            {LOCALE_LABELS[code].label}
            <span className="label">{LOCALE_LABELS[code].code}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
