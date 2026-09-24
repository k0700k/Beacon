// ─────────────────────────────────────────────────────────────────────────────
//  AlertCard.jsx
//  Displays a single community alert. Used in CommunityAlertsPage and Dashboard.
//  Category icon driven by CATEGORY_ICONS from categoriesConfig.
// ─────────────────────────────────────────────────────────────────────────────

import {
  MapPin,
  Clock,
  Siren,
  Eye,
  CloudLightning,
  Monitor,
  AlertTriangle,
  HeartPulse,
  HelpCircle,
} from "lucide-react";
import { CategoryBadge, SeverityBadge, StatusBadge } from "./Badge";
import { CATEGORY_ICONS } from "../../config/categoriesConfig";

// Map icon name strings → lucide components
const ICON_COMPONENTS = {
  Siren,
  Eye,
  CloudLightning,
  Monitor,
  AlertTriangle,
  HeartPulse,
  HelpCircle,
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AlertCard({ alert }) {
  const {
    title,
    description,
    category,
    severity,
    status,
    location,
    created_at,
  } = alert;

  // Resolve the category icon from config
  const iconName = CATEGORY_ICONS[category] ?? "HelpCircle";
  const CategoryIcon = ICON_COMPONENTS[iconName] ?? HelpCircle;

  return (
    <div className="group rounded-[1.35rem] border border-white/8 bg-white/4 p-5 backdrop-blur transition-all duration-200 hover:border-white/16 hover:bg-white/6 hover:-translate-y-0.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <CategoryIcon className="h-4 w-4 shrink-0 text-slate-500" />
          <h3 className="text-base font-semibold text-white">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {category && <CategoryBadge category={category} />}
          {severity && <SeverityBadge severity={severity} />}
          {status && <StatusBadge status={status} />}
        </div>
      </div>

      {description && (
        <p className="mt-2.5 text-sm leading-6 text-slate-400 line-clamp-2">
          {description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        {location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            {location}
          </span>
        )}
        {created_at && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {timeAgo(created_at)}
          </span>
        )}
      </div>
    </div>
  );
}
