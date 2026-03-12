const GA_MEASUREMENT_ID = "G-L4QEGJE7FS";
const GA_SCRIPT_ID = "google-analytics-tag";

const isBrowser = () => typeof window !== "undefined";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

const isLocalRuntime = () =>
  !import.meta.env.PROD ||
  (isBrowser() && LOCAL_HOSTS.has(window.location.hostname));

const ensureDataLayer = () => {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
};

const loadGoogleAnalyticsScript = () => {
  if (!isBrowser()) return Promise.resolve(false);

  const existing = document.getElementById(GA_SCRIPT_ID);
  if (existing) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

const updateConsent = (status) => {
  if (!isBrowser() || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: status === "granted" ? "granted" : "denied"
  });
};

export const syncGoogleAnalyticsConsent = async (status) => {
  if (!isBrowser()) return;
  if (isLocalRuntime()) return;

  const normalizedStatus = status === "granted" ? "granted" : "denied";
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = normalizedStatus !== "granted";

  if (normalizedStatus !== "granted") {
    updateConsent("denied");
    return;
  }

  const loaded = await loadGoogleAnalyticsScript();
  if (!loaded) return;

  ensureDataLayer();
  updateConsent("granted");

  if (!window.__gaConfigured) {
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true
    });
    window.__gaConfigured = true;
  }
};
