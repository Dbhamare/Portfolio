import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = "vulijlj69q";
const CONSENT_STORAGE_KEY = "clarity-consent-v2";
const VISITOR_ID_STORAGE_KEY = "clarity-custom-id";
const SESSION_ID_STORAGE_KEY = "clarity-custom-session-id";

const consentProfiles = {
  granted: { ad_Storage: "granted", analytics_Storage: "granted" },
  denied: { ad_Storage: "denied", analytics_Storage: "denied" }
};

const isBrowser = () => typeof window !== "undefined";

const buildId = (prefix) => {
  if (isBrowser() && window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const readStoredConsent = () => {
  if (!isBrowser()) return null;
  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return stored === "granted" || stored === "denied" ? stored : null;
};

const getOrCreateStorageId = (storage, key, prefix) => {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const next = buildId(prefix);
  storage.setItem(key, next);
  return next;
};

const safeCall = (callback) => {
  try {
    callback();
  } catch (error) {
    // Prevent analytics failures from breaking UI interactions.
  }
};

const toPageId = () => {
  if (!isBrowser()) return "/";
  const { pathname, search, hash } = window.location;
  return `${pathname || "/"}${search || ""}${hash || ""}`;
};

export const getClarityConsentStatus = () => readStoredConsent();

export const initializeClarity = () => {
  if (!isBrowser()) return;
  if (window.__clarityInitialized) return;

  safeCall(() => {
    Clarity.init(CLARITY_PROJECT_ID);
  });
  window.__clarityInitialized = true;

  identifyVisitor("portfolio-visitor");
  setClarityTag("site", "darshan-portfolio");
  setClarityTag("page_type", "portfolio");
  setClarityTag("runtime_env", import.meta.env.PROD ? "production" : "development");

  const consentStatus = readStoredConsent();
  if (consentStatus) setClarityConsentStatus(consentStatus);
};

export const identifyVisitor = (friendlyName = "visitor", pageId = toPageId()) => {
  if (!isBrowser()) return;

  const visitorId = getOrCreateStorageId(
    window.localStorage,
    VISITOR_ID_STORAGE_KEY,
    "visitor"
  );
  const sessionId = getOrCreateStorageId(
    window.sessionStorage,
    SESSION_ID_STORAGE_KEY,
    "session"
  );

  safeCall(() => {
    Clarity.identify(visitorId, sessionId, pageId, friendlyName);
  });
};

export const setClarityTag = (key, value) => {
  if (!isBrowser() || !key || value === null || value === undefined) return;
  const normalizedValue = Array.isArray(value) ? value.map(String) : String(value);
  safeCall(() => {
    Clarity.setTag(key, normalizedValue);
  });
};

export const trackClarityEvent = (eventName) => {
  if (!isBrowser() || !eventName) return;
  safeCall(() => {
    Clarity.event(eventName);
  });
};

export const upgradeClaritySession = (reason) => {
  if (!isBrowser() || !reason) return;
  const key = `clarity-upgrade-${reason}`;
  if (window.sessionStorage.getItem(key)) return;

  safeCall(() => {
    Clarity.upgrade(reason);
  });
  window.sessionStorage.setItem(key, "1");
};

export const setClarityConsentStatus = (status) => {
  if (!isBrowser()) return;
  if (status !== "granted" && status !== "denied") return;

  window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
  safeCall(() => {
    Clarity.consentV2(consentProfiles[status]);
  });
  setClarityTag("cookie_consent", status);
};
