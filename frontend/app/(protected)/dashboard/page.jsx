"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  DashboardPage.jsx
//  Protected dashboard. Stat cards from dashboardConfig. Live Supabase counts.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";;
import { ArrowRight, FileWarning } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { DASHBOARD_STATS } from "../config/dashboardConfig";
import StatCard from "../components/ui/StatCard";
import AlertCard from "../components/ui/AlertCard";
import { APP_CONFIG } from "../config/appConfig";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(
    DASHBOARD_STATS.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {})
  );
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentReports, setRecentReports] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentData();
  }, []);

  async function fetchStats() {
    setStatsLoading(true);
    const results = await Promise.all(
      DASHBOARD_STATS.map(async (stat) => {
        let query = supabase
          .from(stat.supabaseQuery.table)
          .select("*", { count: "exact", head: true });

        if (stat.supabaseQuery.filter) {
          Object.entries(stat.supabaseQuery.filter).forEach(([k, v]) => {
            query = query.eq(k, v);
          });
        }

        const { count } = await query;
        return { id: stat.id, count: count ?? 0 };
      })
    );
    const newStats = {};
    results.forEach((r) => { newStats[r.id] = r.count; });
    setStats(newStats);
    setStatsLoading(false);
  }

  async function fetchRecentData() {
    setDataLoading(true);
    const [{ data: reports }, { data: alerts }] = await Promise.all([
      supabase
        .from("reports")
        .select("id, title, category, severity, status, location, created_at")
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("community_alerts")
        .select("id, title, category, severity, status, location, created_at, description")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);
    setRecentReports(reports ?? []);
    setRecentAlerts(alerts ?? []);
    setDataLoading(false);
  }

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Hey, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Here's the live safety overview for {APP_CONFIG.name}.
        </p>
      </div>

      {/* Stat cards — from dashboardConfig */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            icon={stat.icon}
            color={stat.color}
            value={stats[stat.id]}
            loading={statsLoading}
          />
        ))}
      </section>

      {/* Recent data */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent reports */}
        <section className="rounded-[1.75rem] border border-white/8 bg-white/4 p-5 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Recent Reports</h2>
            <Link href="/admin"
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {dataLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : recentReports.length === 0 ? (
            <EmptyState
              icon={FileWarning}
              text="No reports yet."
              action={{ label: "Submit first report", href: "/report" }}
            />
          ) : (
            <div className="space-y-3">
              {recentReports.map((r) => (
                <AlertCard key={r.id} alert={r} />
              ))}
            </div>
          )}
        </section>

        {/* Active alerts */}
        <section className="rounded-[1.75rem] border border-white/8 bg-white/4 p-5 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Active Alerts</h2>
            <Link href="/alerts"
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {dataLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : recentAlerts.length === 0 ? (
            <EmptyState text="No active alerts." />
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((a) => (
                <AlertCard key={a.id} alert={a} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick actions */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Report an Incident", href: "/report", desc: "Submit a new safety report.", color: "sky" },
          { label: "Trigger SOS", href: "/sos", desc: "Emergency broadcast with your location.", color: "rose" },
          { label: "View Live Map", href: "/map", desc: "See all reports and alerts on the map.", color: "emerald" },
        ].map((q) => (
          <Link
            key={q.href}
            to={q.href}
            className="group rounded-[1.35rem] border border-white/8 bg-white/4 p-5 hover:bg-white/8 transition-all duration-200 hover:-translate-y-0.5"
          >
            <p className="text-sm font-medium text-white">{q.label}</p>
            <p className="mt-1 text-xs text-slate-500">{q.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

function EmptyState({ icon: Icon = FileWarning, text, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 py-8 text-center">
      <Icon className="h-5 w-5 text-slate-600" />
      <p className="text-sm text-slate-500">{text}</p>
      {action && (
        <Link href={action.href}
          className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
