"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Route,
  Users,
  Wrench,
  CreditCard,
  Settings,
  BarChart3,
  FileText,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getNavItemsForRole } from "@/lib/rbac";

const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  LayoutDashboard: LayoutDashboard as React.FC<React.SVGProps<SVGSVGElement>>,
  Truck: Truck as React.FC<React.SVGProps<SVGSVGElement>>,
  Route: Route as React.FC<React.SVGProps<SVGSVGElement>>,
  Users: Users as React.FC<React.SVGProps<SVGSVGElement>>,
  Wrench: Wrench as React.FC<React.SVGProps<SVGSVGElement>>,
  CreditCard: CreditCard as React.FC<React.SVGProps<SVGSVGElement>>,
  BarChart3: BarChart3 as React.FC<React.SVGProps<SVGSVGElement>>,
  Settings: Settings as React.FC<React.SVGProps<SVGSVGElement>>,
  FileText: FileText as React.FC<React.SVGProps<SVGSVGElement>>,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const navItems = user ? getNavItemsForRole(user.role) : [];

  return (
    <aside className="flex flex-col w-[260px] h-screen bg-white border-r border-gray-100 shrink-0">
      {/* Logo */}
      <div className="flex items-center h-16 px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Fleet<span className="text-[#2563EB]">IQ</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 pt-4 pb-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em] px-3 mb-3">
          Menu
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                  active
                    ? "bg-[#2563EB]/10 text-[#2563EB] font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                {Icon && (
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      active
                        ? "bg-[#2563EB] shadow-md shadow-blue-200"
                        : "bg-gray-50 group-hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                    />
                  </div>
                )}
                {item.title}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: version badge */}
      <div className="px-4 py-4 border-t border-gray-50">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-[#16A34A] pulse-dot" />
          <span className="text-xs text-gray-500">FleetIQ v2.0</span>
          <span className="ml-auto text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-100">
            Pro
          </span>
        </div>
      </div>
    </aside>
  );
}
