"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CONSENT_EVENT,
  DEFAULT_CATEGORIES,
  OPEN_SETTINGS_EVENT,
  acceptAll,
  readConsent,
  rejectAll,
  writeConsent,
  type ConsentCategories,
} from "@/lib/cookie-consent";
import { localizedHref, type Locale } from "@/lib/i18n";

type CategoryStrings = {
  label: string;
  desc: string;
  always?: string;
};

export type CookieConsentStrings = {
  title: string;
  body: string;
  learnMore: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  save: string;
  back: string;
  manageLabel: string;
  managePrompt: string;
  categories: {
    necessary: CategoryStrings;
    analytics: CategoryStrings;
    marketing: CategoryStrings;
  };
};

type Props = {
  locale: Locale;
  t: CookieConsentStrings;
};

export function CookieConsent({ locale, t }: Props) {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [categories, setCategories] = useState<ConsentCategories>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage decision must happen post-mount to avoid hydration mismatch
      setOpen(true);
    } else {
      setCategories(existing.categories);
    }
    const openHandler = () => {
      const current = readConsent();
      if (current) setCategories(current.categories);
      setShowSettings(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, openHandler);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, openHandler);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setShowSettings(false);
  }, []);

  const onAcceptAll = () => {
    acceptAll();
    close();
  };
  const onRejectAll = () => {
    rejectAll();
    close();
  };
  const onSave = () => {
    writeConsent(categories);
    close();
  };

  if (!open) return null;

  const privacyHref = localizedHref("/privacy", locale);
  const cookiesHref = localizedHref("/cookies", locale);

  return (
    <>
      <div className="cookie-consent-backdrop" aria-hidden="true" />
      <div
        className="cookie-consent"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
      >
        <div className="cookie-consent-inner">
          {!showSettings ? (
            <>
              <div className="cookie-consent-text">
                <h3 id="cookie-consent-title">{t.title}</h3>
                <p>
                  {t.body}{" "}
                  <Link href={cookiesHref}>{t.learnMore}</Link>
                  {" · "}
                  <Link href={privacyHref}>
                    {locale === "el" ? "Πολιτική Απορρήτου" : "Privacy Policy"}
                  </Link>
                </p>
              </div>
              <div className="cookie-consent-actions">
                <button
                  type="button"
                  className="cookie-btn ghost"
                  onClick={() => setShowSettings(true)}
                >
                  {t.customize}
                </button>
                <button
                  type="button"
                  className="cookie-btn secondary"
                  onClick={onRejectAll}
                >
                  {t.rejectAll}
                </button>
                <button
                  type="button"
                  className="cookie-btn primary"
                  onClick={onAcceptAll}
                >
                  {t.acceptAll}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="cookie-consent-text">
                <h3 id="cookie-consent-title">{t.title}</h3>
                <ul className="cookie-categories">
                  <li>
                    <div className="cookie-cat-head">
                      <strong>{t.categories.necessary.label}</strong>
                      <span className="cookie-pill on">
                        {t.categories.necessary.always}
                      </span>
                    </div>
                    <p>{t.categories.necessary.desc}</p>
                  </li>
                  <li>
                    <div className="cookie-cat-head">
                      <strong>{t.categories.analytics.label}</strong>
                      <label className="cookie-toggle">
                        <input
                          type="checkbox"
                          checked={categories.analytics}
                          onChange={(e) =>
                            setCategories((prev) => ({
                              ...prev,
                              analytics: e.target.checked,
                            }))
                          }
                        />
                        <span className="cookie-toggle-slider" />
                      </label>
                    </div>
                    <p>{t.categories.analytics.desc}</p>
                  </li>
                  <li>
                    <div className="cookie-cat-head">
                      <strong>{t.categories.marketing.label}</strong>
                      <label className="cookie-toggle">
                        <input
                          type="checkbox"
                          checked={categories.marketing}
                          onChange={(e) =>
                            setCategories((prev) => ({
                              ...prev,
                              marketing: e.target.checked,
                            }))
                          }
                        />
                        <span className="cookie-toggle-slider" />
                      </label>
                    </div>
                    <p>{t.categories.marketing.desc}</p>
                  </li>
                </ul>
              </div>
              <div className="cookie-consent-actions">
                <button
                  type="button"
                  className="cookie-btn ghost"
                  onClick={() => setShowSettings(false)}
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  className="cookie-btn primary"
                  onClick={onSave}
                >
                  {t.save}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <ConsentBeacon />
    </>
  );
}

function ConsentBeacon() {
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.categories?.analytics) {
        // Hook point: initialise analytics scripts here when consented.
      }
    };
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);
  return null;
}
