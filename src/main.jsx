import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import {
  ANALYTICS_CONSENT_EVENT,
  getClarityConsentStatus,
  initializeClarity
} from "./clarity";
import "./styles.css";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

const isVercelAnalyticsEnabled = () => {
  if (typeof window === "undefined") return false;
  if (!import.meta.env.PROD) return false;
  if (import.meta.env.VITE_ENABLE_VERCEL_ANALYTICS !== "true") return false;
  return !LOCAL_HOSTS.has(window.location.hostname);
};

function AnalyticsGate() {
  const [consentStatus, setConsentStatus] = useState(() =>
    getClarityConsentStatus()
  );

  useEffect(() => {
    const handleConsentChange = (event) => {
      setConsentStatus(event.detail?.status || getClarityConsentStatus());
    };

    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (consentStatus !== "granted") return;
    initializeClarity();
  }, [consentStatus]);

  if (consentStatus !== "granted") return null;
  if (!isVercelAnalyticsEnabled()) return null;
  return <Analytics />;
}

const rootElement = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
    <AnalyticsGate />
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
