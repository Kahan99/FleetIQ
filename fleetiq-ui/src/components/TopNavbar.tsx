"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useAuth, ROLE_LABELS } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    : "FI";

  const notifications = [
    {
      id: 1,
      text: "Vehicle Eicher Pro 2049 needs maintenance",
      time: "2m ago",
      type: "warning",
    },
    {
      id: 2,
      text: "Trip TRIP/2026/001 completed successfully",
      time: "15m ago",
      type: "success",
    },
    {
      id: 3,
      text: "Driver Suresh Reddy license expiring soon",
      time: "1h ago",
      type: "danger",
    },
  ];

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-8 flex-1">
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          Dashboard
        </h1>
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search everything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-2xl hover:bg-gray-50 text-gray-500 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-[20px] shadow-2xl shadow-blue-900/10 z-50 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
                <span className="font-bold text-sm">Notifications</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">3 NEW</span>
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer group">
                    <p className="text-xs text-gray-700 leading-relaxed font-medium group-hover:text-blue-600">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-1.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-100 mx-2" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-200">
              {initials}
            </div>
            <div className="hidden lg:block text-left mr-1">
              <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || "User"}</p>
              <p className="text-[10px] text-gray-400 font-medium">{user ? ROLE_LABELS[user.role] : "Manager"}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-[20px] shadow-2xl shadow-blue-900/10 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors capitalize">
                  <User className="w-4 h-4" /> Account Settings
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors capitalize mt-1">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
