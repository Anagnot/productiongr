export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "production-cookie-consent";
export const CONSENT_COOKIE_NAME = "production_consent";
export const CONSENT_EVENT = "production:consent-change";
export const OPEN_SETTINGS_EVENT = "production:open-cookie-settings";

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentState = {
  version: number;
  timestamp: string;
  categories: ConsentCategories;
};

export const DEFAULT_CATEGORIES: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed?.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(categories: ConsentCategories): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    categories: { ...categories, necessary: true },
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / privacy-mode errors
    }
    const oneYear = 60 * 60 * 24 * 365;
    const value = encodeURIComponent(
      `${CONSENT_VERSION}:${state.categories.analytics ? "1" : "0"}:${state.categories.marketing ? "1" : "0"}`,
    );
    document.cookie = `${CONSENT_COOKIE_NAME}=${value}; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
    window.dispatchEvent(
      new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }),
    );
  }
  return state;
}

export function acceptAll(): ConsentState {
  return writeConsent({ necessary: true, analytics: true, marketing: true });
}

export function rejectAll(): ConsentState {
  return writeConsent({ necessary: true, analytics: false, marketing: false });
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
}
