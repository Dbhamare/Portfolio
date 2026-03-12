import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import { initializeClarity } from "./clarity";
import "./styles.css";

initializeClarity();

const rootElement = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
