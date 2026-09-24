// ─────────────────────────────────────────────────────────────────────────────
//  appConfig.js
//  Central branding & application identity.
//  Change these values to rebrand the entire app instantly.
// ─────────────────────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  name: "Safer Communities",
  tagline: "Report. Alert. Protect.",
  description:
    "A community-powered safety platform for real-time incident reporting, emergency alerts, and coordinated response.",

  // ── Hero Section ───────────────────────────────────────────────────────────
  hero: {
    badge: "Community Safety Platform",
    title: "Together We Build",
    titleHighlight: "Safer Communities",
    subtitle:
      "Report incidents anonymously, trigger SOS alerts, and stay informed with real-time community safety updates powered by your neighbourhood.",
    cta: {
      primary: { label: "Report an Incident", href: "/report" },
      secondary: { label: "View Community Alerts", href: "/alerts" },
    },
  },

  // ── Stats shown on landing page ────────────────────────────────────────────
  landingStats: [
    { label: "Reports Filed", value: "0" },
    { label: "Alerts Active", value: "0" },
    { label: "Communities", value: "0" },
  ],

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    text: "© 2025 Safer Communities. Built for the hackathon.",
  },

  // ── Meta (SEO) ─────────────────────────────────────────────────────────────
  meta: {
    title: "Safer Communities — Real-Time Safety Platform",
    description:
      "Report incidents, trigger SOS, and stay informed with community safety alerts.",
  },
};
