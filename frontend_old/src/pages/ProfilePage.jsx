// ─────────────────────────────────────────────────────────────────────────────
//  ProfilePage.jsx
//  Displays authenticated user profile info fetched from public.profiles.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { User, Mail, Calendar, ShieldAlert, LogOut, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: selectError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (selectError) {
        throw selectError;
      }
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch database profile. Using session metadata fallback.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  // Fallback metadata if database query fails or is loading
  const email = user?.email ?? "";
  const fullName = profile?.full_name ?? user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "User";
  const avatarUrl = profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? null;
  const role = profile?.role ?? "user";
  const createdAt = profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Recently";

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Your Profile</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your personal account settings and security roles.
        </p>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-[2rem] border border-white/8 bg-white/4 p-6 shadow-glow backdrop-blur-md">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left sm:gap-8">
          {/* Avatar */}
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="h-24 w-24 rounded-2xl object-cover ring-2 ring-sky-400/20"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-400/30 text-2xl font-bold text-sky-400 shadow-lg shadow-sky-500/10">
                {initials || <User className="h-10 w-10" />}
              </div>
            )}
            <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md border border-slate-900">
              <CheckCircle className="h-4 w-4" />
            </span>
          </div>

          {/* Core Info */}
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-bold text-white">{fullName}</h2>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-slate-900/60 border border-white/10 px-3 py-0.5 text-xs text-slate-400">
                {email}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 border border-sky-500/30 px-3 py-0.5 text-xs font-semibold text-sky-300 capitalize">
                {role}
              </span>
            </div>
            <p className="text-xs text-slate-500 pt-1">
              User ID: {user?.id}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs text-amber-300">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Detailed Stats / Fields */}
        <div className="mt-8 border-t border-white/8 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Mail className="h-4 w-4" />
                <span className="text-xs font-medium">Email Address</span>
              </div>
              <p className="text-sm font-semibold text-white">{email}</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">Account Created</span>
              </div>
              <p className="text-sm font-semibold text-white">{createdAt}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end border-t border-white/8 pt-6">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 text-sm font-medium text-rose-300 hover:bg-rose-500/20 transition-all active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
