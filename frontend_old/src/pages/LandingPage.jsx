// ─────────────────────────────────────────────────────────────────────────────
//  LandingPage.jsx
//  Public hero page. All copy from appConfig.js — rebrand by editing config.
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from "react-router-dom";
import {
  Shield,
  FileWarning,
  Bell,
  Map,
  Siren,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { APP_CONFIG } from "../config/appConfig";
import { INCIDENT_CATEGORIES, CATEGORY_COLORS } from "../config/categoriesConfig";

const FEATURE_LIST = [
  {
    icon: FileWarning,
    title: "Anonymous Reporting",
    desc: "Submit incident reports with full anonymity protection.",
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/20",
  },
  {
    icon: Siren,
    title: "Instant SOS",
    desc: "One tap to broadcast your location and trigger emergency alerts.",
    color: "text-rose-400",
    bg: "bg-rose-400/10 border-rose-400/20",
  },
  {
    icon: Bell,
    title: "Community Alerts",
    desc: "Stay informed with real-time safety updates from your community.",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    icon: Map,
    title: "Live Safety Map",
    desc: "Visualise all reports and alerts on an interactive map.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
];

export default function LandingPage() {
  const { hero, name, landingStats } = APP_CONFIG;

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/40 p-8 sm:p-12 glass-premium">
        {/* Background glow overlay */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

        <div className="mb-6 flex flex-wrap items-center gap-3 relative z-10">
          <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-300">
            {hero.badge}
          </span>
          <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300">
            Community-Powered
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            Supabase-Backed
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] relative z-10">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.28em] font-semibold text-sky-400">
              Emergency Dispatch & Safety
            </p>
            <h1 className="max-w-3xl text-4.5xl font-extrabold leading-tight text-white sm:text-5.5xl tracking-tight">
              {hero.title}{" "}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {hero.titleHighlight}
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-400">
              {hero.subtitle}
            </p>

            {/* Stats row */}
            <div className="grid gap-4 sm:grid-cols-3">
              {landingStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 hover-glow transition-all duration-300 hover:scale-[1.02] hover:bg-slate-950/60"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={hero.cta.primary.href}
                id="cta-report"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                {hero.cta.primary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={hero.cta.secondary.href}
                id="cta-alerts"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                {hero.cta.secondary.label}
              </Link>
            </div>
          </div>

          {/* Categories panel */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/40 p-6 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-4">
              Incident Categories
            </p>
            <div className="grid gap-2">
              {INCIDENT_CATEGORIES.map((cat) => {
                const colorClass = CATEGORY_COLORS[cat] ?? "text-slate-400 bg-slate-400/10 border-slate-400/30";
                return (
                  <div
                    key={cat}
                    className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-[1.01] hover:bg-white/5 ${colorClass}`}
                  >
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    {cat}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="grid gap-6 lg:grid-cols-2">
        {FEATURE_LIST.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className={`rounded-[1.75rem] border ${f.bg} p-6 backdrop-blur transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className={`mb-4 inline-flex rounded-xl p-2.5 ${f.bg}`}>
                <Icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{f.desc}</p>
            </div>
          );
        })}
      </section>

      {/* ── Quick nav / How it works ───────────────────────────────────────── */}
      <section id="how-it-works" className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Report Incident", href: "/report", accent: "sky" },
          { label: "View Map", href: "/map", accent: "emerald" },
          { label: "Emergency SOS", href: "/sos", accent: "rose" },
        ].map((btn) => (
          <Link
            key={btn.href}
            to={btn.href}
            className="group flex items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/4 px-5 py-4 hover:bg-white/8 transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="text-sm font-medium text-white">{btn.label}</span>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
          </Link>
        ))}
      </section>
    </div>
  );
}
