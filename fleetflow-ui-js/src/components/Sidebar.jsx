"use client";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Route,
  Users,
  Wrench,
  CreditCard,
  Settings,
  BarChart3,
  FileText } from
"lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getNavItemsForRole } from "@/lib/rbac";

const ICON_MAP = {
  LayoutDashboard: LayoutDashboard,
  Truck: Truck,
  Route: Route,
  Users: Users,
  Wrench: Wrench,
  CreditCard: CreditCard,
  BarChart3: BarChart3,
  Settings: Settings,
  FileText: FileText
};

export default function Sidebar() {
  const location = useLocation(); const pathname = location.pathname;;
  const { user } = useAuth();
  const navItems = user ? getNavItemsForRole(user.role) : [];

  return (
    <aside className="fixed left-0 top-0 bottom-0 flex flex-col w-[260px] bg-white border-r border-gray-100 z-30">
      {/* Logo */}
      <div className="flex items-center h-20 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2563EB] rounded-[12px] flex items-center justify-center shadow-lg shadow-blue-100/50">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Fleet<span className="text-[#2563EB]">IQ</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-3">
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${active ?
                "bg-blue-50 text-[#2563EB]" :
                "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`
                }>
                
                {Icon &&
                <Icon
                  className={`w-5 h-5 ${active ? "text-[#2563EB]" : "text-gray-400 group-hover:text-gray-500"}`} />

                }
                {item.title}
              </Link>);

          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-50">
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-gray-600 font-medium">All systems active</span>
          </div>
        </div>
      </div>
    </aside>);

}