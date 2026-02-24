"use client";

import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import RBACGuard from "@/components/RBACGuard";
import { Loader2 } from "lucide-react";

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Loading FleetIQ…</p>
        </div>
      </div>);

  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-[260px]">
        <TopNavbar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <RBACGuard><Outlet /></RBACGuard>
          </div>
        </main>
      </div>
    </div>);

}