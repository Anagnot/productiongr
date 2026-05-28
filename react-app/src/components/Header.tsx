"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LangSwitch } from "./LangSwitch";
import { CHANNELS, PRODUCTS } from "@/lib/catalog-data";
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
  portfolio: string;
  about: string;
  contact: string;
  ctaBrief: string;
};

type SubLink = { href: string; label: string };
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
      href: "/services",
      label: nav.services,
      children: PRODUCTS.map((p) => ({
        href: `/services/${p.slug}`,
        label: p.name[locale],
      })),
    },
    {
      href: "/channels",
      label: nav.channels,
      children: CHANNELS.map((c) => ({
        href: `/channels/${c.slug}`,
        label: c.name[locale],
      })),
    },
    { href: "/about", label: nav.about },
    { href: "/contact", label: nav.contact },
  ];

  function isActive(localized: string) {
    if (localized === localizedHref("/", locale))
      return pathname === localized;
    return pathname === localized || pathname.startsWith(localized + "/");
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
                            className={pathname === ch ? "active" : undefined}
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
                            className={pathname === ch ? "active" : undefined}
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
