// ─────────────────────────────────────────────────────────────────────────────
//  Badge.jsx
//  Reusable badge for severity levels and categories.
//  Reads colors from categoriesConfig.
// ─────────────────────────────────────────────────────────────────────────────

import { CATEGORY_COLORS, SEVERITY_LEVELS } from "../../config/categoriesConfig";

export function CategoryBadge({ category }) {
  const colorClass =
    CATEGORY_COLORS[category] ??
    "text-slate-400 bg-slate-400/10 border-slate-400/30";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {category}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const level = SEVERITY_LEVELS.find((s) => s.value === severity) ?? SEVERITY_LEVELS[0];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${level.bg} ${level.color}`}
    >
      {level.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    pending: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    reviewing: "text-sky-400 bg-sky-400/10 border-sky-400/30",
    active: "text-rose-400 bg-rose-400/10 border-rose-400/30",
    resolved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    dismissed: "text-slate-400 bg-slate-400/10 border-slate-400/30",
    responded: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  };
  const colorClass =
    map[status?.toLowerCase()] ??
    "text-slate-400 bg-slate-400/10 border-slate-400/30";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {status ?? "unknown"}
    </span>
  );
}
