"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (adminOnly) {
        const role = user.app_metadata?.role ?? user.user_metadata?.role ?? "user";
        if (role !== "admin") {
          router.replace("/dashboard");
        }
      }
    }
  }, [user, loading, adminOnly, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
      </div>
    );
  }

  if (adminOnly) {
    const role = user.app_metadata?.role ?? user.user_metadata?.role ?? "user";
    if (role !== "admin") {
      return null;
    }
  }

  return children;
}
