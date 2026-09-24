module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        glow: "0 30px 80px rgba(14, 165, 233, 0.18)",
        "glow-rose": "0 30px 80px rgba(251, 113, 133, 0.18)",
        "glow-emerald": "0 30px 80px rgba(52, 211, 153, 0.18)",
      },
      colors: {
        ink: "#020617",
        flare: "#fb7185",
        skyglass: "#38bdf8",
        surface: "#0f172a",
      },
      borderOpacity: {
        8: "0.08",
        16: "0.16",
      },
      backgroundOpacity: {
        4: "0.04",
        6: "0.06",
        8: "0.08",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease-out both",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
