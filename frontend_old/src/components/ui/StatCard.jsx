// ─────────────────────────────────────────────────────────────────────────────
//  StatCard.jsx
//  Dashboard stat card. Driven by dashboardConfig.js entries.
// ─────────────────────────────────────────────────────────────────────────────

import {
  FileText,
  Bell,
  Siren,
  Users,
  TrendingUp,
  Map,
  Shield,
  AlertTriangle,
} from "lucide-react";

const ICON_MAP = {
  FileText,
  Bell,
  Siren,
  Users,
  TrendingUp,
  Map,
  Shield,
  AlertTriangle,
};

const COLOR_MAP = {
  sky: {
    icon: "text-sky-400",
    glow: "shadow-sky-500/10",
    border: "border-sky-400/20",
    bg: "bg-sky-400/5",
  },
  rose: {
    icon: "text-rose-400",
    glow: "shadow-rose-500/10",
    border: "border-rose-400/20",
    bg: "bg-rose-400/5",
  },
  orange: {
    icon: "text-orange-400",
    glow: "shadow-orange-500/10",
    border: "border-orange-400/20",
    bg: "bg-orange-400/5",
  },
  emerald: {
    icon: "text-emerald-400",
    glow: "shadow-emerald-500/10",
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/5",
  },
};

export default function StatCard({ title, icon, color = "sky", value, loading = false }) {
  const Icon = ICON_MAP[icon] ?? FileText;
  const c = COLOR_MAP[color] ?? COLOR_MAP.sky;

  return (
    <div
      className={`rounded-[1.35rem] border ${c.border} ${c.bg} p-5 shadow-lg ${c.glow} backdrop-blur transition-transform duration-200 hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
        <Icon className={`h-4 w-4 ${c.icon}`} />
      </div>
      <p className="mt-4 text-3xl font-semibold text-white">
        {loading ? (
          <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-white/10" />
        ) : (
          value ?? 0
        )}
      </p>
    </div>
  );
}
