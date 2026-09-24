// ─────────────────────────────────────────────────────────────────────────────
//  ProtectedRoute.jsx
//  Redirects unauthenticated users to /login.
//  Usage: <ProtectedRoute> <YourPage /> </ProtectedRoute>
// ─────────────────────────────────────────────────────────────────────────────

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin check: role stored in user_metadata or app_metadata
  if (adminOnly) {
    const role =
      user.app_metadata?.role ?? user.user_metadata?.role ?? "user";
    if (role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
