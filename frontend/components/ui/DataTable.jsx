"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  DataTable.jsx
//  Reusable admin data table. Pass any Supabase table config from dashboardConfig.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { StatusBadge, CategoryBadge, SeverityBadge } from "./Badge";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

function formatCell(col, val) {
  if (val === null || val === undefined) return <span className="text-slate-600">—</span>;
  if (col === "status") return <StatusBadge status={val} />;
  if (col === "category") return <CategoryBadge category={val} />;
  if (col === "severity") return <SeverityBadge severity={val} />;
  if (col === "created_at") {
    return (
      <span className="text-xs text-slate-400">
        {new Date(val).toLocaleString()}
      </span>
    );
  }
  if (col === "id") {
    return <span className="font-mono text-xs text-slate-500">{String(val).slice(0, 8)}…</span>;
  }
  return <span className="text-sm text-slate-200">{String(val)}</span>;
}

export default function DataTable({ config, onStatusChange }) {
  const { table, columns, label, statusField, statusOptions } = config;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error, count } = await supabase
      .from(table)
      .select(columns.join(", "), { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      setError(error.message);
    } else {
      setRows(data ?? []);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [table, page]);

  async function handleStatusChange(id, newStatus) {
    setUpdating(id);
    const { error } = await supabase
      .from(table)
      .update({ [statusField]: newStatus })
      .eq("id", id);
    if (!error) {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, [statusField]: newStatus } : r))
      );
      onStatusChange?.();
    }
    setUpdating(null);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-white/4 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <h3 className="text-base font-semibold text-white">{label}</h3>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="px-5 py-4 text-sm text-rose-400">
          Error loading data: {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/8">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-slate-500"
                >
                  {col.replace(/_/g, " ")}
                </th>
              ))}
              {statusField && statusOptions && (
                <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-slate-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/4">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3">
                      <div className="h-4 w-24 animate-pulse rounded bg-white/8" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/4 hover:bg-white/4 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3">
                      {formatCell(col, row[col])}
                    </td>
                  ))}
                  {statusField && statusOptions && (
                    <td className="px-4 py-3">
                      <select
                        value={row[statusField] ?? ""}
                        disabled={updating === row.id}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:opacity-50"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/8 text-sm text-slate-400">
          <span>{total} total records</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg p-1.5 hover:bg-white/8 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg p-1.5 hover:bg-white/8 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
