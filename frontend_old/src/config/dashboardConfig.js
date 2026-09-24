// ─────────────────────────────────────────────────────────────────────────────
//  dashboardConfig.js
//  All dashboard stat cards defined here. UI renders from this config.
//  No hardcoded cards in JSX.
// ─────────────────────────────────────────────────────────────────────────────

export const DASHBOARD_STATS = [
  {
    id: "total_reports",
    title: "Total Reports",
    icon: "FileText",
    color: "sky",
    supabaseQuery: { table: "reports", count: true },
    value: 0,
  },
  {
    id: "active_alerts",
    title: "Active Alerts",
    icon: "Bell",
    color: "rose",
    supabaseQuery: { table: "community_alerts", filter: { status: "active" }, count: true },
    value: 0,
  },
  {
    id: "sos_sent",
    title: "SOS Alerts Sent",
    icon: "Siren",
    color: "orange",
    supabaseQuery: { table: "sos_alerts", count: true },
    value: 0,
  },
  {
    id: "users_registered",
    title: "Users Registered",
    icon: "Users",
    color: "emerald",
    supabaseQuery: { table: "profiles", count: true },
    value: 0,
  },
];

export const ADMIN_TABLES = [
  {
    id: "reports",
    label: "Incident Reports",
    table: "reports",
    columns: ["id", "title", "category", "severity", "status", "created_at"],
    statusField: "status",
    statusOptions: ["pending", "reviewing", "resolved", "dismissed"],
  },
  {
    id: "community_alerts",
    label: "Community Alerts",
    table: "community_alerts",
    columns: ["id", "title", "category", "severity", "status", "created_at"],
    statusField: "status",
    statusOptions: ["active", "resolved", "dismissed"],
  },
  {
    id: "sos_alerts",
    label: "SOS Alerts",
    table: "sos_alerts",
    columns: ["id", "message", "status", "latitude", "longitude", "created_at"],
    statusField: "status",
    statusOptions: ["active", "responded", "resolved"],
  },
];
