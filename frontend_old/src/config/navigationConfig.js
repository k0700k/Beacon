// ─────────────────────────────────────────────────────────────────────────────
//  navigationConfig.js
//  All nav links defined here. Navbar renders from this config.
//  Add/remove routes without touching JSX.
// ─────────────────────────────────────────────────────────────────────────────

// PUBLIC_NAV_LINKS: Shown on the public home page for guest users.
export const PUBLIC_NAV_LINKS = [
  { label: "Home", href: "/", icon: "Home", isHash: false },
  { label: "Features", href: "/#features", icon: "Sparkles", isHash: true },
  { label: "How It Works", href: "/#how-it-works", icon: "HelpCircle", isHash: true },
];

// AUTH_NAV_LINKS: Shown for authenticated app users.
export const AUTH_NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Report Incident", href: "/report", icon: "FileWarning" },
  { label: "SOS Alert", href: "/sos", icon: "Siren" },
  { label: "Community Alerts", href: "/alerts", icon: "Bell" },
  { label: "Map", href: "/map", icon: "Map" },
  { label: "Profile", href: "/profile", icon: "User" },
];

// ADMIN_NAV_LINKS: Protected panel visible only to admin roles.
export const ADMIN_NAV_LINKS = [
  { label: "Admin Panel", href: "/admin", icon: "ShieldCheck", requiresAdmin: true },
];

