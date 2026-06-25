"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LangSwitch } from "./LangSwitch";
import {
  LOCALES,
  LOCALE_LABELS,
  localizedHref,
  stripLocale,
  type Locale,
} from "@/lib/i18n";

type NavStrings = {
  home: string;
  services: string;
  channels: string;
  company: string;
  about: string;
  contact: string;
  ctaBrief: string;
  phone: string;
  howWeWork: string;
  sustainability: string;
  chSuperMarkets: string;
  chRetailBeauty: string;
  chPharmacy: string;
  chHoreca: string;
  chKiosk: string;
  chExhibitions: string;
  chEvents: string;
  chYourChannel: string;
  prodFloorCounter: string;
  prodDisplaySystems: string;
  prodGondolaPallet: string;
  prodWallShelves: string;
  prodGlorifiers: string;
  prodHorecaMaterials: string;
  prodAllBuildTypes: string;
};

const PHONE_HREF = "tel:+302102322750";

type SubLink = { href: string; label: string; variant?: "premium" | "link" };
type NavLink = { href: string; label: string; children?: SubLink[] };

type Props = { locale: Locale; nav: NavStrings };

export function Header({ locale, nav }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  const links: NavLink[] = [
    { href: "/", label: nav.home },
    {
      href: "/channels",
      label: nav.channels,
      children: [
        { href: "/channels/super-market", label: nav.chSuperMarkets },
        { href: "/channels/retail-beauty", label: nav.chRetailBeauty },
        { href: "/channels/pharma", label: nav.chPharmacy },
        { href: "/channels/horeca", label: nav.chHoreca },
        { href: "/channels/kiosk", label: nav.chKiosk },
        { href: "/channels/exhibitions", label: nav.chExhibitions },
        { href: "/channels/events", label: nav.chEvents },
        { href: "/quote", label: nav.chYourChannel, variant: "link" },
      ],
    },
    {
      href: "/services",
      label: nav.services,
      children: [
        { href: "/services?group=floor-counter", label: nav.prodFloorCounter },
        { href: "/services?group=display-systems", label: nav.prodDisplaySystems },
        { href: "/services?group=glorifiers", label: nav.prodGlorifiers },
        { href: "/services?group=gondola-pallet", label: nav.prodGondolaPallet },
        { href: "/services?group=wall-shelves", label: nav.prodWallShelves },
        { href: "/services?group=horeca-materials", label: nav.prodHorecaMaterials },
        { href: "/services", label: nav.prodAllBuildTypes, variant: "link" },
      ],
    },
    {
      href: "/about",
      label: nav.company,
      children: [
        { href: "/about", label: nav.about },
        { href: "/how-we-work", label: nav.howWeWork },
        { href: "/sustainability", label: nav.sustainability },
      ],
    },
    { href: "/contact", label: nav.contact },
  ];

  function isActive(localized: string) {
    if (localized === localizedHref("/", locale))
      return pathname === localized;
    return pathname === localized || pathname.startsWith(localized + "/");
  }

  function subClass(ch: string, variant?: SubLink["variant"]) {
    return (
      [
        variant ? `dd-${variant}` : null,
        pathname === ch && variant !== "link" ? "active" : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  }

  useEffect(() => {
    setDrawerOpen(false);
    setExpandedMobile(null);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.classList.add("no-scroll");
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  function switchLocale(target: Locale) {
    const { path } = stripLocale(pathname);
    if (target !== locale) router.push(localizedHref(path, target));
    setDrawerOpen(false);
  }

  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href={localizedHref("/", locale)} className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-horizontal-black.svg" alt="Production LTD" />
          </Link>
          <nav className="site-nav">
            {links.map((l) => {
              const href = localizedHref(l.href, locale);
              if (l.children) {
                return (
                  <div key={l.href} className="nav-item has-dropdown">
                    <Link
                      href={href}
                      className={isActive(href) ? "active" : undefined}
                    >
                      {l.label}
                      <span className="dd-caret" aria-hidden="true">▾</span>
                    </Link>
                    <div className="dropdown-menu" role="menu">
                      {l.children.map((c) => {
                        const ch = localizedHref(c.href, locale);
                        return (
                          <Link
                            key={c.href}
                            href={ch}
                            role="menuitem"
                            className={subClass(ch, c.variant)}
                          >
                            {c.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={l.href}
                  href={href}
                  className={isActive(href) ? "active" : undefined}
                >
                  {l.label}
                </Link>
              );
            })}
            <LangSwitch locale={locale} />
            <a href={PHONE_HREF} className="nav-phone">
              {nav.phone}
            </a>
            <Link href={localizedHref("/quote", locale)} className="cta primary">
              {nav.ctaBrief}
            </Link>
          </nav>
          <button
            type="button"
            className="menu-btn"
            aria-label="Άνοιγμα μενού"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <span className="bars" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-drawer"
        className={`mobile-drawer${drawerOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Μενού πλοήγησης"
        aria-hidden={!drawerOpen}
      >
        <div className="drawer-head">
          <Link
            href={localizedHref("/", locale)}
            className="logo"
            onClick={() => setDrawerOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-horizontal-black.svg" alt="Production LTD" />
          </Link>
          <button
            type="button"
            className="close-btn"
            aria-label="Κλείσιμο μενού"
            onClick={() => setDrawerOpen(false)}
          />
        </div>
        <div className="drawer-body">
          {links.map((l) => {
            const href = localizedHref(l.href, locale);
            if (l.children) {
              const open = expandedMobile === l.href;
              return (
                <div key={l.href} className="drawer-group">
                  <div className="drawer-group-head">
                    <Link
                      href={href}
                      className={isActive(href) ? "active" : undefined}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {l.label}
                    </Link>
                    <button
                      type="button"
                      className={`drawer-toggle${open ? " open" : ""}`}
                      aria-expanded={open}
                      aria-label={open ? "Σύμπτυξη" : "Επέκταση"}
                      onClick={() => setExpandedMobile(open ? null : l.href)}
                    >
                      ▾
                    </button>
                  </div>
                  {open && (
                    <div className="drawer-sub">
                      {l.children.map((c) => {
                        const ch = localizedHref(c.href, locale);
                        return (
                          <Link
                            key={c.href}
                            href={ch}
                            className={subClass(ch, c.variant)}
                            onClick={() => setDrawerOpen(false)}
                          >
                            {c.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={l.href}
                href={href}
                className={isActive(href) ? "active" : undefined}
                onClick={() => setDrawerOpen(false)}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <div className="drawer-foot">
          <a href={PHONE_HREF} className="drawer-phone">
            {nav.phone}
          </a>
          <Link
            href={localizedHref("/quote", locale)}
            className="cta primary"
            onClick={() => setDrawerOpen(false)}
          >
            {nav.ctaBrief}
          </Link>
          <div className="lang-row" aria-label="Γλώσσα">
            {LOCALES.map((code) => (
              <a
                key={code}
                href={localizedHref(stripLocale(pathname).path, code)}
                className={code === locale ? "active" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  switchLocale(code);
                }}
              >
                {LOCALE_LABELS[code].code}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
