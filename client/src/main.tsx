import { createRoot } from "react-dom/client";
import { configureTextBuilder } from "troika-three-text";
import App from "./App";
import "./index.css";

configureTextBuilder({ useWorker: false });

// Register service worker for caching
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Service worker registration failed silently
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
