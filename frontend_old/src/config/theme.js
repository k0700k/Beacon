// ─────────────────────────────────────────────────────────────────────────────
//  theme.js
//  Design tokens. Mirrors the existing dark glassmorphism aesthetic.
//  Consumed by components and Tailwind config extensions.
// ─────────────────────────────────────────────────────────────────────────────

export const THEME = {
  // ── Palette ───────────────────────────────────────────────────────────────
  colors: {
    ink: "#020617",          // deepest background
    surface: "#0f172a",     // card backgrounds
    border: "rgba(255,255,255,0.08)",
    accent: "#38bdf8",      // sky-400 — primary accent
    danger: "#fb7185",      // rose-400 — alerts, SOS
    success: "#34d399",     // emerald-400
    warning: "#fbbf24",     // amber-400
  },

  // ── Background Gradient ───────────────────────────────────────────────────
  background: {
    gradient:
      "radial-gradient(circle at top, rgba(56,189,248,0.16), transparent 32%), " +
      "radial-gradient(circle at 82% 18%, rgba(251,113,133,0.14), transparent 24%), " +
      "linear-gradient(160deg, #020617 0%, #0f172a 48%, #111827 100%)",
  },

  // ── Glass Card ────────────────────────────────────────────────────────────
  card: {
    bg: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    shadow: "0 30px 80px rgba(14,165,233,0.18)",
    radius: "1.75rem",
    blur: "backdrop-filter: blur(12px)",
  },

  // ── Typography ────────────────────────────────────────────────────────────
  font: {
    family: "'Inter', 'Segoe UI', sans-serif",
  },
};

// CSS custom properties — injected via index.css
export const CSS_VARS = {
  "--color-accent": THEME.colors.accent,
  "--color-danger": THEME.colors.danger,
  "--color-success": THEME.colors.success,
  "--color-warning": THEME.colors.warning,
  "--color-ink": THEME.colors.ink,
  "--color-surface": THEME.colors.surface,
};
