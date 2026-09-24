// ─────────────────────────────────────────────────────────────────────────────
//  SOSPage.jsx
//  Emergency SOS. Gets geolocation, saves to sos_alerts Supabase table.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Siren, MapPin, CheckCircle, AlertCircle, LocateFixed } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function SOSPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const [countdown, setCountdown] = useState(null);
  const [timerId, setTimerId] = useState(null);

  function getLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocating(false);
      },
      (err) => {
        setError("Could not get your location: " + err.message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function startSOSCountdown() {
    if (!location) {
      setError("Please share your location first.");
      return;
    }
    setError(null);
    setCountdown(3);
    
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setCountdown(null);
          triggerSOS();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerId(id);
  }

  function cancelSOS() {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setCountdown(null);
  }

  async function triggerSOS() {
    setSending(true);
    setError(null);

    const { error: insertError } = await supabase.from("sos_alerts").insert([
      {
        latitude: location.lat,
        longitude: location.lng,
        message: message || "SOS — I need help!",
        status: "active",
        user_id: user?.id ?? null,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setSent(true);
    }
    setSending(false);
  }

  if (sent) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center relative">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="flex max-w-sm flex-col items-center gap-5 text-center relative z-10">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 shadow-[0_0_20px_rgba(52,211,153,0.2)] animate-pulse">
            <CheckCircle className="h-11 w-11 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">SOS Sent successfully!</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your emergency alert has been broadcast with your location. Stay
            safe — emergency monitors have been notified.
          </p>
          <button
            onClick={() => { setSent(false); setLocation(null); setMessage(""); }}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            Send Another Alert
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center py-8 relative">
      {/* ambient red glow background */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500/20 to-red-500/20 border border-rose-500/35 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <Siren className="h-6 w-6 text-rose-400" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Emergency SOS</h1>
          <p className="mt-2 text-sm text-slate-400">
            One tap triggers a critical neighborhood alert with your active GPS coordinates.
          </p>
        </div>

        {/* SOS Panic Trigger */}
        <div className="flex flex-col items-center justify-center py-6 relative">
          {countdown !== null ? (
            <div className="flex h-48 w-48 flex-col items-center justify-center rounded-full border-4 border-rose-500/30 bg-rose-950/80 shadow-[0_0_40px_rgba(244,63,94,0.3)] animate-radar">
              <span className="text-5xl font-black text-rose-400 animate-ping">{countdown}</span>
              <button
                onClick={cancelSOS}
                className="mt-2 rounded-lg bg-white/10 px-3 py-1 text-[11px] font-bold text-white hover:bg-white/20 uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={startSOSCountdown}
              disabled={sending || !location}
              id="btn-sos"
              className={`relative flex h-48 w-48 flex-col items-center justify-center rounded-full border-[6px] border-rose-500/15 bg-gradient-to-br from-rose-600 to-red-700 font-extrabold text-white shadow-2xl transition-all duration-500 ${
                !location
                  ? "opacity-35 cursor-not-allowed border-rose-500/5 from-slate-800 to-slate-900"
                  : "hover:scale-[1.04] hover:from-rose-500 hover:to-red-600 active:scale-95 shadow-rose-500/30 animate-radar"
              }`}
            >
              <Siren className="h-12 w-12 text-white animate-pulse" />
              <span className="mt-2 text-[13px] font-black tracking-widest uppercase">
                {sending ? "Sending..." : "Trigger SOS"}
              </span>
            </button>
          )}
        </div>

        {/* Location card */}
        <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-md">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-semibold text-white">GPS Coordinates</h3>
            </div>
            {location && (
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Live Active
              </span>
            )}
          </div>

          {location ? (
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="rounded-xl bg-white/4 p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Latitude</span>
                <span className="font-mono text-sm text-white">{location.lat.toFixed(6)}</span>
              </div>
              <div className="rounded-xl bg-white/4 p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Longitude</span>
                <span className="font-mono text-sm text-white">{location.lng.toFixed(6)}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 pt-1 text-[11px] text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Captured location accuracy within {Math.round(location.accuracy)} meters
              </div>
            </div>
          ) : (
            <button
              onClick={getLocation}
              disabled={locating}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm font-medium text-sky-300 hover:bg-sky-400/20 disabled:opacity-50 transition-all duration-300 hover:scale-[1.01]"
            >
              <LocateFixed className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
              {locating ? "Acquiring satellite lock…" : "Locate My Device"}
            </button>
          )}
        </div>

        {/* Message */}
        <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-md">
          <label className="mb-2 block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Emergency Description <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder="Describe your situation (e.g. 'Stuck in elevator', 'Suspicious activity near me')"
            className="w-full resize-none rounded-xl border border-white/5 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-colors"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-center text-[10px] uppercase tracking-wider text-slate-600">
          ⚠️ Broadcasts are saved to dispatch tables and shared immediately.
        </p>
      </div>
    </div>
  );
}
