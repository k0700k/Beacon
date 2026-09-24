// ─────────────────────────────────────────────────────────────────────────────
//  MapPage.jsx
//  Interactive Leaflet + OpenStreetMap. Displays reports, SOS, alerts.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Map, Siren, Bell, FileWarning, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase";
import { CategoryBadge, SeverityBadge, StatusBadge } from "../components/ui/Badge";

// Fix Leaflet default marker icon (broken in Vite/webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const DEFAULT_CENTER = [-20.1619, 57.4989]; // Mauritius
const DEFAULT_ZOOM = 11;

// Layer toggle state
const LAYERS = [
  { id: "reports", label: "Reports", icon: FileWarning, color: "#38bdf8" },
  { id: "sos", label: "SOS Alerts", icon: Siren, color: "#fb7185" },
  { id: "community", label: "Community Alerts", icon: Bell, color: "#fbbf24" },
];

export default function MapPage() {
  const [reports, setReports] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [communityAlerts, setCommunityAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLayers, setActiveLayers] = useState(new Set(["reports", "sos", "community"]));

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const [
      { data: reps },
      { data: sos },
      { data: community },
    ] = await Promise.all([
      supabase
        .from("reports")
        .select("id, title, category, severity, status, latitude, longitude, location")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .limit(200),
      supabase
        .from("sos_alerts")
        .select("id, message, status, latitude, longitude, created_at")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .limit(200),
      supabase
        .from("community_alerts")
        .select("id, title, category, severity, status, latitude, longitude, location")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .limit(200),
    ]);
    setReports(reps ?? []);
    setSosAlerts(sos ?? []);
    setCommunityAlerts(community ?? []);
    setLoading(false);
  }

  function toggleLayer(id) {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const total =
    (activeLayers.has("reports") ? reports.length : 0) +
    (activeLayers.has("sos") ? sosAlerts.length : 0) +
    (activeLayers.has("community") ? communityAlerts.length : 0);

  return (
    <div className="py-4">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/20">
            <Map className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Safety Map</h1>
            <p className="text-sm text-slate-400">{total} markers visible</p>
          </div>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Layer toggles */}
      <div className="mb-4 flex flex-wrap gap-2">
        {LAYERS.map((layer) => {
          const Icon = layer.icon;
          const active = activeLayers.has(layer.id);
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              style={active ? { borderColor: layer.color + "40", color: layer.color, backgroundColor: layer.color + "15" } : {}}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition-all ${
                active
                  ? ""
                  : "border-white/10 text-slate-500 bg-transparent"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {layer.label}
              {active && (
                <span className="ml-1 rounded-full px-1.5 text-[10px] font-medium"
                  style={{ backgroundColor: layer.color + "30" }}>
                  {layer.id === "reports"
                    ? reports.length
                    : layer.id === "sos"
                    ? sosAlerts.length
                    : communityAlerts.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: "600px", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Reports — sky blue markers */}
          {activeLayers.has("reports") &&
            reports.map((r) => (
              <CircleMarker
                key={`report-${r.id}`}
                center={[r.latitude, r.longitude]}
                radius={8}
                pathOptions={{ color: "#38bdf8", fillColor: "#38bdf8", fillOpacity: 0.7 }}
              >
                <Popup>
                  <MapPopup
                    type="Report"
                    title={r.title}
                    category={r.category}
                    severity={r.severity}
                    status={r.status}
                    location={r.location}
                  />
                </Popup>
              </CircleMarker>
            ))}

          {/* SOS alerts — rose red markers */}
          {activeLayers.has("sos") &&
            sosAlerts.map((s) => (
              <CircleMarker
                key={`sos-${s.id}`}
                center={[s.latitude, s.longitude]}
                radius={10}
                pathOptions={{ color: "#fb7185", fillColor: "#fb7185", fillOpacity: 0.85 }}
              >
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <p style={{ fontWeight: 600, color: "#fb7185", marginBottom: 4 }}>
                      🚨 SOS Alert
                    </p>
                    <p style={{ fontSize: 12, color: "#94a3b8" }}>
                      {s.message || "No message provided"}
                    </p>
                    <p style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
                      Status: {s.status}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

          {/* Community alerts — amber markers */}
          {activeLayers.has("community") &&
            communityAlerts.map((a) => (
              <CircleMarker
                key={`alert-${a.id}`}
                center={[a.latitude, a.longitude]}
                radius={8}
                pathOptions={{ color: "#fbbf24", fillColor: "#fbbf24", fillOpacity: 0.7 }}
              >
                <Popup>
                  <MapPopup
                    type="Alert"
                    title={a.title}
                    category={a.category}
                    severity={a.severity}
                    status={a.status}
                    location={a.location}
                  />
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {LAYERS.map((l) => (
          <div key={l.id} className="flex items-center gap-2 text-xs text-slate-400">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: l.color }}
            />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function MapPopup({ type, title, category, severity, status, location }) {
  return (
    <div style={{ minWidth: 180, fontFamily: "inherit" }}>
      <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b", marginBottom: 4 }}>
        {type}
      </p>
      <p style={{ fontWeight: 600, color: "#f8fafc", fontSize: 13, marginBottom: 6 }}>
        {title}
      </p>
      {location && (
        <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>📍 {location}</p>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {category && (
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.08)", color: "#cbd5e1" }}>
            {category}
          </span>
        )}
        {severity && (
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.08)", color: "#cbd5e1" }}>
            {severity}
          </span>
        )}
      </div>
    </div>
  );
}
