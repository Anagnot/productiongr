"use client";

import { useEffect } from "react";
import {
  CONSENT_EVENT,
  readConsent,
  type ConsentState,
} from "@/lib/cookie-consent";

const GA_MEASUREMENT_ID = "G-CT2M45K57T";
const GA_DISABLE_KEY = `ga-disable-${GA_MEASUREMENT_ID}`;
// Matches the "up to 14 months" stated on the cookie policy page.
const COOKIE_EXPIRES_SECONDS = 60 * 60 * 24 * 30 * 14;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// GA's documented opt-out switch: window["ga-disable-<ID>"] = true.
function setGaDisabled(disabled: boolean) {
  (window as unknown as Record<string, boolean>)[GA_DISABLE_KEY] = disabled;
}

// gtag.js is only fetched once the visitor opts in to analytics.
// Client-side route changes are picked up by GA4's history-based page views.
function enableAnalytics() {
  setGaDisabled(false);
  if (window.gtag) {
    window.gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the Arguments object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    cookie_expires: COOKIE_EXPIRES_SECONDS,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function disableAnalytics() {
  setGaDisabled(true);
  window.gtag?.("consent", "update", { analytics_storage: "denied" });

  // Withdrawn consent: drop the _ga cookies GA set on the registrable domain.
  const host = window.location.hostname;
  const domains = ["", host, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of document.cookie.split("; ").map((c) => c.split("=")[0])) {
    if (!name.startsWith("_ga")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}

export function GoogleAnalytics() {
  useEffect(() => {
    const apply = (state: ConsentState | null) => {
      if (state?.categories.analytics) enableAnalytics();
      else disableAnalytics();
    };
    apply(readConsent());
    const handler = (e: Event) =>
      apply((e as CustomEvent<ConsentState>).detail);
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);
  return null;
}
