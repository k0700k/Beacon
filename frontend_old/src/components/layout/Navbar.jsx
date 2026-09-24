// ─────────────────────────────────────────────────────────────────────────────
//  Navbar.jsx
//  Responsive navbar driven entirely by navigationConfig.js.
//  Dark mode toggle + auth state-aware links.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  FileWarning,
  Siren,
  Bell,
  Map,
  ShieldCheck,
  LogOut,
  LogIn,
  Moon,
  Sun,
  Menu,
  X,
  Shield,
  User,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { APP_CONFIG } from "../../config/appConfig";
import {
  PUBLIC_NAV_LINKS,
  AUTH_NAV_LINKS,
  ADMIN_NAV_LINKS,
} from "../../config/navigationConfig";
import { useAuth } from "../../context/AuthContext";

const ICON_MAP = {
  Home,
  LayoutDashboard,
  FileWarning,
  Siren,
  Bell,
  Map,
  ShieldCheck,
  User,
  Sparkles,
  HelpCircle,
  LogIn,
};

export default function Navbar({ darkMode, onToggleDark }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin =
    user?.app_metadata?.role === "admin" ||
    user?.user_metadata?.role === "admin";

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const desktopLinks = user
    ? [...AUTH_NAV_LINKS, ...(isAdmin ? ADMIN_NAV_LINKS : [])]
    : PUBLIC_NAV_LINKS;

  const mobileLinks = user
    ? [...AUTH_NAV_LINKS, ...(isAdmin ? ADMIN_NAV_LINKS : [])]
    : [
        ...PUBLIC_NAV_LINKS,
        { label: "Login", href: "/login", icon: "LogIn" },
        { label: "Get Started", href: "/login?mode=signup", icon: "Sparkles" },
      ];

  return (
    <nav className="sticky top-0 z-50 glass-premium">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-95 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <Shield className="h-4.5 w-4.5 text-sky-400" />
          </div>
          <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            {APP_CONFIG.name}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1.5 md:flex">
          {desktopLinks.map((link) => {
            const Icon = ICON_MAP[link.icon] ?? Home;
            if (link.isHash) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-300 border text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </a>
              );
            }
            return (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-300 border ${
                    isActive
                      ? "bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent"
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </NavLink>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            id="dark-mode-toggle"
            className="rounded-xl p-2 text-slate-400 hover:bg-white/8 hover:text-white transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <button
              onClick={handleSignOut}
              className="hidden items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-400 hover:bg-white/8 hover:text-white transition-colors md:flex"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-1"
              >
                Login
              </Link>
              <Link
                to="/login?mode=signup"
                className="rounded-xl border border-sky-400/30 bg-sky-400/10 px-3.5 py-2 text-sm font-semibold text-sky-300 hover:bg-sky-400/20 transition-all active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/8 hover:text-white transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-white/8 bg-slate-950/95 px-4 pb-4 md:hidden">
          <div className="mt-3 flex flex-col gap-1">
            {mobileLinks.map((link) => {
              const Icon = ICON_MAP[link.icon] ?? Home;
              if (link.isHash) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 border text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </a>
                );
              }
              return (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 border ${
                      isActive
                        ? "bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_10px_rgba(56,189,248,0.08)]"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              );
            })}
            
            {user && (
              <div className="mt-2 pt-2 border-t border-white/8">
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
