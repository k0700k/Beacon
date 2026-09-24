// ─────────────────────────────────────────────────────────────────────────────
//  categoriesConfig.js
//  Incident categories. The entire app (forms, filters, maps) reads from here.
//  To pivot to Women Safety, Cyberbullying, etc. — edit this file only.
// ─────────────────────────────────────────────────────────────────────────────

export const INCIDENT_CATEGORIES = [
  "Emergency",
  "Suspicious Activity",
  "Disaster",
  "Cyberbullying",
  "Harassment",
  "Medical",
  "Other",
];

export const SEVERITY_LEVELS = [
  { value: "low", label: "Low", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30" },
  { value: "medium", label: "Medium", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30" },
  { value: "high", label: "High", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30" },
  { value: "critical", label: "Critical", color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/30" },
];

// Category → icon mapping (lucide-react icon names)
export const CATEGORY_ICONS = {
  Emergency: "Siren",
  "Suspicious Activity": "Eye",
  Disaster: "CloudLightning",
  Cyberbullying: "Monitor",
  Harassment: "AlertTriangle",
  Medical: "HeartPulse",
  Other: "HelpCircle",
};

// Category → accent color (Tailwind classes)
export const CATEGORY_COLORS = {
  Emergency: "text-rose-400 bg-rose-400/10 border-rose-400/30",
  "Suspicious Activity": "text-amber-400 bg-amber-400/10 border-amber-400/30",
  Disaster: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  Cyberbullying: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  Harassment: "text-pink-400 bg-pink-400/10 border-pink-400/30",
  Medical: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  Other: "text-slate-400 bg-slate-400/10 border-slate-400/30",
};
