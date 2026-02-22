"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Truck, AlertCircle, Loader2 } from "lucide-react";
import { useAuth, ROLE_LABELS, type UserRole } from "@/context/AuthContext";

const ROLES: UserRole[] = [
  "fleet_manager",
  "dispatcher",
  "safety_officer",
  "financial_analyst",
];

const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  fleet_manager: "bg-blue-600 text-white",
  dispatcher: "bg-emerald-600 text-white",
  safety_officer: "bg-amber-500 text-black",
  financial_analyst: "bg-purple-600 text-white",
};

const DEMO_CREDS: Record<UserRole, { email: string; password: string }> = {
  fleet_manager: { email: "manager@fleetflow.com", password: "fleet123" },
  dispatcher: { email: "dispatch@fleetflow.com", password: "fleet123" },
  safety_officer: { email: "safety@fleetflow.com", password: "fleet123" },
  financial_analyst: { email: "finance@fleetflow.com", password: "fleet123" },
};

export default function LoginPage() {
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<UserRole>("fleet_manager");
  const [email, setEmail] = useState("manager@fleetflow.com");
  const [password, setPassword] = useState("fleet123");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [user, authLoading, router]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDS[role].email);
    setPassword(DEMO_CREDS[role].password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed.");
      setLoading(false);
    }
  };

  const initials = email ? email.split("@")[0].slice(0, 2).toUpperCase() : "FF";

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              FleetFlow
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Sign in to your fleet dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#161616] border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          {/* Avatar + Role Badge */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl border-2 border-blue-500/40 shadow-lg shadow-blue-500/20">
                {initials}
              </div>
              <span className="text-gray-500 text-xs text-center max-w-[100px] truncate">
                {email || "—"}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${ROLE_BADGE_COLORS[selectedRole]}`}
            >
              {ROLE_LABELS[selectedRole]}
            </span>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 block">
              Select Role (Demo)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    selectedRole === role
                      ? "border-blue-500/60 bg-blue-600/15 text-blue-300"
                      : "border-white/[0.08] bg-white/[0.04] text-gray-500 hover:border-white/20 hover:text-gray-300"
                  }`}
                >
                  {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                placeholder="you@fleetflow.com"
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/60 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/60 transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Forgot Password */}
          <p className="text-center text-sm mt-4">
            <Link
              href="#"
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              Forgot password?
            </Link>
          </p>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Register
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-700 mt-4">
          Click a role above to auto-fill demo credentials • Password:{" "}
          <span className="text-gray-500">fleet123</span>
        </p>
      </div>
    </div>
  );
}
