// ─────────────────────────────────────────────────────────────────────────────
//  supabase.js
//  Supabase client singleton. Import this wherever DB/auth is needed.
//  Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Warn developer if env vars are missing (not a crash — app still renders)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. " +
      "Copy .env.example to .env and fill in your project credentials."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
