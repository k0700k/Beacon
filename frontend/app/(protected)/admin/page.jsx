"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  AdminPage.jsx
//  Protected admin dashboard. Reusable DataTable for each table in ADMIN_TABLES.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ADMIN_TABLES } from "../config/dashboardConfig";
import DataTable from "../components/ui/DataTable";

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(ADMIN_TABLES[0].id);

  const currentTable = ADMIN_TABLES.find((t) => t.id === activeTab);

  return (
    <div className="py-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 ring-1 ring-purple-400/20">
          <ShieldCheck className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Admin Panel</h1>
          <p className="text-sm text-slate-400">
            Manage reports, alerts, and SOS events.
          </p>
        </div>
      </div>

      {/* Tab bar — tabs driven from dashboardConfig.ADMIN_TABLES */}
      <div className="mb-5 flex gap-1 rounded-2xl border border-white/8 bg-white/4 p-1.5">
        {ADMIN_TABLES.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === t.id
                ? "bg-slate-700 text-white shadow"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Data table */}
      {currentTable && (
        <DataTable
          key={currentTable.id}
          config={currentTable}
          onStatusChange={() => {}}
        />
      )}
    </div>
  );
}
