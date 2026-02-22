"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Route,
  Users,
  Wrench,
  CreditCard,
  Settings,
  LogOut,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { useAuth, ROLE_LABELS, ROLE_COLORS } from "@/context/AuthContext";
import { getNavItemsForRole, ROLE_META } from "@/lib/rbac";

const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  LayoutDashboard: LayoutDashboard as React.FC<React.SVGProps<SVGSVGElement>>,
  Truck: Truck as React.FC<React.SVGProps<SVGSVGElement>>,
  Route: Route as React.FC<React.SVGProps<SVGSVGElement>>,
  Users: Users as React.FC<React.SVGProps<SVGSVGElement>>,
  Wrench: Wrench as React.FC<React.SVGProps<SVGSVGElement>>,
  CreditCard: CreditCard as React.FC<React.SVGProps<SVGSVGElement>>,
  BarChart3: BarChart3 as React.FC<React.SVGProps<SVGSVGElement>>,
  Settings: Settings as React.FC<React.SVGProps<SVGSVGElement>>,
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navItems = user ? getNavItemsForRole(user.role) : [];
  const roleMeta = user ? ROLE_META[user.role] : null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "FF";

  return (
    <div className="flex flex-col w-64 h-screen bg-white border-r border-gray-200 shrink-0">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-black text-blue-600 tracking-tight">
            FleetFlow
          </span>
        </div>
      </div>

      {/* User Profile Card */}
      {user && roleMeta && (
        <div className="p-4 border-b border-gray-100">
          <div
            className={`p-3 rounded-xl border ${roleMeta.borderColor} ${roleMeta.bgColor}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${roleMeta.accentColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-gray-900 font-bold text-sm truncate">
                  {user.name}
                </p>
                <div
                  className={`inline-flex items-center gap-1 text-xs font-semibold ${roleMeta.color}`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {ROLE_LABELS[user.role]}
                </div>
              </div>
            </div>
            {/* Access badge */}
            <div className="mt-2 flex flex-wrap gap-1">
              {roleMeta.capabilities.slice(0, 3).map((cap) => (
                <span
                  key={cap}
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${roleMeta.bgColor} ${roleMeta.color} border ${roleMeta.borderColor}`}
                >
                  {cap}
                </span>
              ))}
              {roleMeta.capabilities.length > 3 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                  +{roleMeta.capabilities.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nav — only shows accessible routes */}
      <div className="flex-1 overflow-y-auto py-3 px-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
          Navigation
        </p>
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-150 font-medium text-sm group ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-4 h-4 mr-3 ${active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                  />
                )}
                {item.title}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm group"
        >
          <LogOut className="w-4 h-4 mr-3 group-hover:text-red-500" />
          Sign Out
          {user && (
            <span className="ml-auto text-xs text-gray-400 truncate max-w-[70px]">
              {user.email.split("@")[0]}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
