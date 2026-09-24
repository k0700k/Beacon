// ─────────────────────────────────────────────────────────────────────────────
//  ReportIncidentPage.jsx
//  Submits to Supabase `reports` table + `evidence-files` storage bucket.
//  Category options from categoriesConfig.js — no hardcoded selects.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileWarning,
  MapPin,
  Upload,
  Send,
  AlertCircle,
  CheckCircle,
  LocateFixed,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import {
  INCIDENT_CATEGORIES,
  SEVERITY_LEVELS,
} from "../config/categoriesConfig";

const INITIAL_FORM = {
  title: "",
  description: "",
  category: INCIDENT_CATEGORIES[0],
  severity: "medium",
  location: "",
  latitude: "",
  longitude: "",
  anonymous: false,
};

export default function ReportIncidentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function getLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      (err) => {
        setError("Could not get location: " + err.message);
        setLocating(false);
      }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let image_url = null;

      // Upload image to evidence-files bucket
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("evidence-files")
          .upload(path, imageFile, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("evidence-files")
          .getPublicUrl(path);
        image_url = urlData?.publicUrl ?? null;
      }

      // Insert report
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        severity: form.severity,
        location: form.location || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        image_url,
        anonymous: form.anonymous,
        status: "pending",
        user_id: form.anonymous ? null : (user?.id ?? null),
      };

      const { error: insertError } = await supabase
        .from("reports")
        .insert([payload]);

      if (insertError) throw insertError;

      setSuccess(true);
      setForm(INITIAL_FORM);
      setImageFile(null);
      setImagePreview(null);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/20 ring-1 ring-emerald-400/30">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Report Submitted!</h2>
          <p className="text-sm text-slate-400">
            Thank you for keeping the community safe. Redirecting…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 ring-1 ring-sky-400/20">
          <FileWarning className="h-5 w-5 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Report an Incident</h1>
          <p className="text-sm text-slate-400">Your report helps keep the community safer.</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1fr_340px]"
      >
        {/* Main form */}
        <div className="space-y-6 rounded-3xl border border-white/5 bg-slate-900/40 p-6 sm:p-8 glass-premium">
          {/* Title */}
          <Field label="Incident Title *">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Brief description of the incident"
              className={inputClass}
            />
          </Field>

          {/* Category + Severity */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category *">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                {INCIDENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Severity *">
              <select
                name="severity"
                value={form.severity}
                onChange={handleChange}
                className={inputClass}
              >
                {SEVERITY_LEVELS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide more details about what happened…"
              className={`${inputClass} resize-none`}
            />
          </Field>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {loading ? "Submitting…" : "Submit Report"}
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Location */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 glass-premium">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-medium text-white">Location</h3>
            </div>
            <Field label="Location Name">
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Downtown Market"
                className={inputClass}
              />
            </Field>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Latitude">
                <input
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="-20.1234"
                  className={inputClass}
                />
              </Field>
              <Field label="Longitude">
                <input
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="57.5678"
                  className={inputClass}
                />
              </Field>
            </div>
            <button
              type="button"
              onClick={getLocation}
              disabled={locating}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-sky-400/25 bg-sky-400/10 px-4 py-2.5 text-xs text-sky-300 hover:bg-sky-400/20 disabled:opacity-50 transition-colors"
            >
              <LocateFixed className={`h-3.5 w-3.5 ${locating ? "animate-pulse" : ""}`} />
              {locating ? "Detecting…" : "Use My Location"}
            </button>
          </div>

          {/* Image upload */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 glass-premium">
            <div className="mb-4 flex items-center gap-2">
              <Upload className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-medium text-white">Evidence Photo</h3>
            </div>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: 160 }}
                />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute right-2 top-2 rounded-lg bg-slate-900/80 px-2 py-1 text-xs text-slate-300 hover:text-white"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-white/15 py-6 text-xs text-slate-500 hover:border-white/30 hover:text-slate-400 transition-colors"
              >
                <Upload className="h-5 w-5" />
                Click to upload photo
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Anonymous toggle */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 glass-premium">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-white">Submit Anonymously</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Your name won't be linked to this report.
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={form.anonymous}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full border border-white/15 bg-slate-800 transition-colors peer-checked:bg-sky-500" />
                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/5 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-sky-500/30 focus:outline-none focus:ring-1 focus:ring-sky-500/30 hover:border-white/10 transition-all duration-300";

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
