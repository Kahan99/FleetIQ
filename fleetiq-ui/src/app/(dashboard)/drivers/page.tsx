"use client";

import { useState, useEffect } from "react";
import {
  UserCircle2,
  Loader2,
  Search,
  Shield,
  AlertTriangle,
  Star,
  Clock,
} from "lucide-react";
import { getDrivers, toggleDriverStatus } from "@/lib/api";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setDrivers(await getDrivers());
    } catch {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDrivers();
  }, []);

  const filtered = drivers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const safetyColor = (s: number) =>
    s >= 90 ? "#16A34A" : s >= 70 ? "#F59E0B" : "#DC2626";
  const isLicenseExpired = (d: string) => {
    if (!d) return false;
    return new Date(d) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Driver Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Performance, safety scores and availability
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="w-7 h-7 text-[#2563EB] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover group"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB]/10 to-[#2563EB]/5 flex items-center justify-center flex-shrink-0">
                  <UserCircle2 className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {d.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {d.license_number || "No license"}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${d.status === "active" ? "bg-[#16A34A]/10 text-[#16A34A]" : d.status === "on_trip" ? "bg-[#2563EB]/10 text-[#2563EB]" : "bg-gray-100 text-gray-400"}`}
                >
                  {(d.status || "inactive").replace(/_/g, " ")}
                </span>
              </div>

              {/* License Expiry */}
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">License expires:</span>
                <span
                  className={`text-xs font-semibold ${isLicenseExpired(d.license_expiry) ? "text-[#DC2626]" : "text-gray-700"}`}
                >
                  {d.license_expiry || "N/A"}
                  {isLicenseExpired(d.license_expiry) && (
                    <span className="ml-1 text-[10px] bg-[#DC2626]/10 text-[#DC2626] px-1.5 py-0.5 rounded-full">
                      EXPIRED
                    </span>
                  )}
                </span>
              </div>

              {/* Completion Rate */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500">Completion Rate</span>
                  <span className="font-semibold text-gray-700">
                    {d.completion_rate || 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${d.completion_rate || 0}%`,
                      backgroundColor:
                        (d.completion_rate || 0) >= 80
                          ? "#16A34A"
                          : (d.completion_rate || 0) >= 60
                            ? "#F59E0B"
                            : "#DC2626",
                    }}
                  />
                </div>
              </div>

              {/* Safety Score + Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: safetyColor(d.safety_score || 0) }}
                  >
                    <span
                      className="text-xs font-bold"
                      style={{ color: safetyColor(d.safety_score || 0) }}
                    >
                      {d.safety_score || 0}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 leading-tight">
                      Safety
                    </p>
                    <p
                      className="text-[10px] font-semibold leading-tight"
                      style={{ color: safetyColor(d.safety_score || 0) }}
                    >
                      {(d.safety_score || 0) >= 90
                        ? "Excellent"
                        : (d.safety_score || 0) >= 70
                          ? "Good"
                          : "Needs Review"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    toggleDriverStatus(
                      d.id,
                      d.status === "active" ? "inactive" : "active",
                    ).then(fetchDrivers);
                  }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg ${d.status === "active" ? "bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626]/20" : "bg-[#16A34A]/10 text-[#16A34A] hover:bg-[#16A34A]/20"}`}
                >
                  {d.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
