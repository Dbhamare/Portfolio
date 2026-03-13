const CLARITY_PROJECT_ID = "vulijlj69q";
const CONSENT_STORAGE_KEY = "clarity-consent-v2";
const VISITOR_ID_STORAGE_KEY = "clarity-custom-id";
const SESSION_ID_STORAGE_KEY = "clarity-custom-session-id";
const CLARITY_IDLE_TIMEOUT_MS = 2000;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
export const ANALYTICS_CONSENT_EVENT = "portfolio:analytics-consent-changed";

const consentProfiles = {
  granted: { ad_Storage: "granted", analytics_Storage: "granted" },
  denied: { ad_Storage: "denied", analytics_Storage: "denied" }
};

const isBrowser = () => typeof window !== "undefined";
const isClarityRuntimeEnabled = () => {
  if (!isBrowser()) return false;
  if (!import.meta.env.PROD) return false;
  if (import.meta.env.VITE_ENABLE_CLARITY !== "true") return false;
  return !LOCAL_HOSTS.has(window.location.hostname);
};

let clarityApi = null;
let clarityApiPromise = null;
let pendingOperations = [];
let flushScheduled = false;
let flushing = false;
let initRequested = false;
let cachedVisitorId = null;
let cachedSessionId = null;

const buildId = (prefix) => {
  if (isBrowser() && window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const readStoredConsent = () => {
  if (!isBrowser()) return null;
  let stored = null;
  try {
    stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    stored = null;
  }
  return stored === "granted" || stored === "denied" ? stored : null;
};

const hasGrantedConsent = () => readStoredConsent() === "granted";

const notifyConsentChange = (status) => {
  if (!isBrowser()) return;
  window.dispatchEvent(
    new CustomEvent(ANALYTICS_CONSENT_EVENT, {
      detail: { status }
    })
  );
};

const getOrCreateStorageId = (storage, key, prefix) => {
  let existing = null;
  try {
    existing = storage.getItem(key);
  } catch {
    existing = null;
  }
  if (existing) return existing;
  const next = buildId(prefix);
  try {
    storage.setItem(key, next);
  } catch {
    // Fall through with in-memory id when storage is unavailable.
  }
  return next;
};

const safeCall = (callback) => {
  try {
    callback();
  } catch {
    // Prevent analytics failures from breaking UI interactions.
  }
};

const scheduleInIdle = (callback) => {
  if (!isBrowser()) return;

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(callback, { timeout: CLARITY_IDLE_TIMEOUT_MS });
    return;
  }

  window.setTimeout(callback, 0);
};

function requestFlush() {
  if (!isClarityRuntimeEnabled() || !hasGrantedConsent() || flushScheduled) return;
  flushScheduled = true;

  const runFlush = () => scheduleInIdle(() => void flushPendingOperations());
  if (document.readyState === "complete") {
    runFlush();
    return;
  }

  window.addEventListener("load", runFlush, { once: true });
}

const loadClarityApi = async () => {
  if (clarityApi) return clarityApi;
  if (!clarityApiPromise) {
    clarityApiPromise = import("@microsoft/clarity")
      .then((module) => module.default || module)
      .catch(() => null);
  }

  const loadedApi = await clarityApiPromise;
  if (loadedApi) clarityApi = loadedApi;
  return clarityApi;
};

const ensureClarityInitialized = async () => {
  if (!isClarityRuntimeEnabled() || !hasGrantedConsent()) return null;
  const loadedApi = await loadClarityApi();
  if (!loadedApi) return null;

  if (!window.__clarityInitialized) {
    safeCall(() => {
      loadedApi.init(CLARITY_PROJECT_ID);
    });
    window.__clarityInitialized = true;
  }

  return loadedApi;
};

const flushPendingOperations = async () => {
  if (!isClarityRuntimeEnabled() || !hasGrantedConsent() || flushing) return;
  flushing = true;
  flushScheduled = false;

  const loadedApi = await ensureClarityInitialized();
  if (!loadedApi) {
    pendingOperations = [];
    flushing = false;
    return;
  }

  const operations = pendingOperations;
  pendingOperations = [];
  operations.forEach((operation) => {
    safeCall(() => {
      operation(loadedApi);
    });
  });

  flushing = false;
  if (pendingOperations.length) requestFlush();
};

const enqueueOperation = (operation) => {
  if (!isClarityRuntimeEnabled() || !hasGrantedConsent()) return;
  pendingOperations.push(operation);
  requestFlush();
};

const toPageId = () => {
  if (!isBrowser()) return "/";
  const { pathname, search, hash } = window.location;
  return `${pathname || "/"}${search || ""}${hash || ""}`;
};

export const getClarityConsentStatus = () => readStoredConsent();

export const initializeClarity = () => {
  if (!isClarityRuntimeEnabled()) return;
  if (!hasGrantedConsent()) return;
  if (initRequested) return;
  initRequested = true;

  identifyVisitor("portfolio-visitor");
  setClarityTag("site", "darshan-portfolio");
  setClarityTag("page_type", "portfolio");
  setClarityTag("runtime_env", import.meta.env.PROD ? "production" : "development");
  enqueueOperation((api) => {
    api.consentV2(consentProfiles.granted);
  });
  setClarityTag("cookie_consent", "granted");
};

export const identifyVisitor = (friendlyName = "visitor", pageId = toPageId()) => {
  if (!isBrowser()) return;

  enqueueOperation((api) => {
    if (!cachedVisitorId) {
      cachedVisitorId = getOrCreateStorageId(
        window.localStorage,
        VISITOR_ID_STORAGE_KEY,
        "visitor"
      );
    }
    if (!cachedSessionId) {
      cachedSessionId = getOrCreateStorageId(
        window.sessionStorage,
        SESSION_ID_STORAGE_KEY,
        "session"
      );
    }

    api.identify(cachedVisitorId, cachedSessionId, pageId, friendlyName);
  });
};

export const setClarityTag = (key, value) => {
  if (!isBrowser() || !key || value === null || value === undefined) return;
  const normalizedValue = Array.isArray(value) ? value.map(String) : String(value);
  enqueueOperation((api) => {
    api.setTag(key, normalizedValue);
  });
};

export const trackClarityEvent = (eventName) => {
  if (!isBrowser() || !eventName) return;
  enqueueOperation((api) => {
    api.event(eventName);
  });
};

export const upgradeClaritySession = (reason) => {
  if (!isBrowser() || !reason) return;
  const key = `clarity-upgrade-${reason}`;
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // Continue even when sessionStorage is blocked.
  }
  enqueueOperation((api) => {
    api.upgrade(reason);
  });
};

export const setClarityConsentStatus = (status) => {
  if (!isBrowser()) return;
  if (status !== "granted" && status !== "denied") return;

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch {
    // Ignore storage errors in restricted browsing contexts.
  }
  notifyConsentChange(status);

  if (status === "granted") {
    initializeClarity();
    enqueueOperation((api) => {
      api.consentV2(consentProfiles.granted);
    });
    setClarityTag("cookie_consent", "granted");
    return;
  }

  pendingOperations = [];
  if (clarityApi) {
    safeCall(() => {
      clarityApi.consentV2(consentProfiles.denied);
      clarityApi.setTag("cookie_consent", "denied");
    });
  }
};
