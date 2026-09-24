// ─────────────────────────────────────────────────────────────────────────────
//  Layout.jsx
//  Wraps all pages with Navbar + footer. Dark mode state lives here.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import Navbar from "./Navbar";
import { APP_CONFIG } from "../../config/appConfig";

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("safer-dark-mode");
    return stored !== null ? stored === "true" : true; // default: dark
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("safer-dark-mode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      <footer className="border-t border-white/8 py-6 text-center text-xs text-slate-600">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-3 w-3 text-sky-600" />
          <span>{APP_CONFIG.footer.text}</span>
        </div>
      </footer>
    </div>
  );
}
