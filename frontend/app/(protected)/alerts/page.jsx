"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  CommunityAlertsPage.jsx
//  Fetches from Supabase community_alerts table. No hardcoded alerts.
//  Supports category + severity filtering from categoriesConfig.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { Bell, Search, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase";
import { INCIDENT_CATEGORIES } from "../config/categoriesConfig";
import AlertCard from "../components/ui/AlertCard";

export default function CommunityAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchAlerts();

    // Real-time subscription
    const channel = supabase
      .channel("community_alerts_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_alerts" },
        () => fetchAlerts()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchAlerts() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("community_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      setError(error.message);
    } else {
      setAlerts(data ?? []);
    }
    setLoading(false);
  }

  const filtered = alerts.filter((a) => {
    const matchSearch =
      !search ||
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase()) ||
      a.location?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "All" || a.category === categoryFilter;
    const matchStatus =
      statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="py-4">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-400/10 ring-1 ring-rose-400/20">
            <Bell className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Community Alerts</h1>
            <p className="text-sm text-slate-400">
              {alerts.length} alert{alerts.length !== 1 ? "s" : ""} •{" "}
              {alerts.filter((a) => a.status === "active").length} active
            </p>
          </div>
        </div>
        <button
          onClick={fetchAlerts}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts…"
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-600 focus:border-sky-400/50 focus:outline-none"
          />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white focus:border-sky-400/50 focus:outline-none"
        >
          <option value="All">All Categories</option>
          {INCIDENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white focus:border-sky-400/50 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          Failed to load alerts: {error}
        </div>
      )}

      {/* Alerts grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-[1.35rem] bg-white/5"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-dashed border-white/10 py-16 text-center">
          <Bell className="h-8 w-8 text-slate-600" />
          <p className="text-slate-500">
            {search || categoryFilter !== "All" || statusFilter !== "All"
              ? "No alerts match your filters."
              : "No community alerts yet. Be the first to report."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
