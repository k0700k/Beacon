// ─────────────────────────────────────────────────────────────────────────────
//  LoginPage.jsx
//  Email + Google OAuth via Supabase Auth. Handles sign-in and sign-up.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Shield, Mail, Lock, Globe, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { APP_CONFIG } from "../config/appConfig";

export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Check if '?mode=signup' query parameter is present to auto-toggle mode
    const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
    setMode(initialMode);
  }, [searchParams]);

  useEffect(() => {
    // Parse URL hash parameters to catch OAuth and callback error states
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const errorCode = hashParams.get("error");
      const errorDesc = hashParams.get("error_description");

      if (errorCode) {
        // Beautify error message for user
        const humanReadableError = errorCode.replace(/_/g, " ");
        setError(`${humanReadableError.charAt(0).toUpperCase() + humanReadableError.slice(1)}: ${errorDesc || ""}`);
        
        // Remove the error fragment from the URL bar so it doesn't persist on refresh
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const fn = mode === "login" ? signInWithEmail : signUpWithEmail;
    const { error } = await fn(email, password);

    if (error) {
      setError(error.message);
    } else if (mode === "signup") {
      setMessage("Check your email to confirm your account.");
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  }

  async function handleGoogle() {
    try {
      setError(null);
      const { error } = await signInWithGoogle();
      if (error) setError(error.message);
      // Redirect handled by Supabase OAuth flow
    } catch (err) {
      console.error("Google Auth Exception:", err);
      setError(err.message || "Failed to initiate Google sign-in. Please check your network connection or ad-blocker.");
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 ring-1 ring-sky-400/30">
              <Shield className="h-6 w-6 text-sky-400" />
            </div>
            <h1 className="text-2xl font-semibold text-white">
              {mode === "login" ? "Sign in to" : "Join"} {APP_CONFIG.name}
            </h1>
            <p className="text-sm text-slate-400">
              {mode === "login"
                ? "Access your safety dashboard and reports."
                : "Create an account to start reporting incidents."}
            </p>
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            id="btn-google-signin"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            <Globe className="h-4 w-4 text-sky-400" />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-xs text-slate-600">or</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-slate-400" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-sky-400/50 focus:outline-none focus:ring-1 focus:ring-sky-400/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-slate-400" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-sky-400/50 focus:outline-none focus:ring-1 focus:ring-sky-400/50"
                />
              </div>
            </div>

            {/* Error / Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                {message}
              </div>
            )}

            <button
              id="btn-email-submit"
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setMessage(null); }}
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>

          <p className="mt-3 text-center text-xs text-slate-600">
            <Link to="/" className="hover:text-slate-400 transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
