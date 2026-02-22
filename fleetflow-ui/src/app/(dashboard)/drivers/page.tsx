"use client";

import { useState, useEffect } from "react";
import { getDrivers, toggleDriverStatus } from "@/lib/api";
import { StatusPill } from "@/components/StatusPill";
import {
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Activity,
} from "lucide-react";

const DRIVER_STATUSES = [
  {
    value: "on_duty",
    label: "On Duty",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    value: "off_duty",
    label: "Off Duty",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  {
    value: "suspended",
    label: "Suspended",
    color: "bg-red-100 text-red-700 border-red-200",
  },
];

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (driverId: number, status: string) => {
    try {
      await toggleDriverStatus(driverId, status);
      fetchData();
    } catch (error) {
      alert("Failed to update status: " + error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Driver Registry</h1>
        <p className="text-gray-500 mt-1">
          Monitor safety performance, trip completion rates, and license
          compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drivers.map((driver) => {
          const isExpired =
            driver.license_expiry &&
            new Date(driver.license_expiry) < new Date();
          const completionRate =
            driver.trips_total > 0
              ? Math.round((driver.trips_completed / driver.trips_total) * 100)
              : 0;

          return (
            <div
              key={driver.id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-xl text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    {driver.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900">
                      {driver.name}
                    </h4>
                    <p className="text-sm font-medium text-gray-400">
                      License: {driver.license_number || "N/A"}
                    </p>
                  </div>
                </div>
                <StatusPill status={driver.status} />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Safety
                  </div>
                  <div
                    className={`text-2xl font-black ${driver.safety_score >= 90 ? "text-green-600" : driver.safety_score >= 70 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {driver.safety_score || 0}%
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    <Activity className="w-3 h-3 mr-1" />
                    Completion
                  </div>
                  <div className="text-2xl font-black text-blue-600">
                    {completionRate}%
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold">
                    {driver.trips_completed || 0}/{driver.trips_total || 0}{" "}
                    trips
                  </div>
                </div>
                <div
                  className={`p-4 rounded-2xl border ${isExpired ? "bg-red-50 border-red-100" : "bg-gray-50 border-transparent"}`}
                >
                  <div className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Expiry
                  </div>
                  <div
                    className={`text-sm font-black flex items-center ${isExpired ? "text-red-700" : "text-gray-900"}`}
                  >
                    {driver.license_expiry || "No Date"}
                    {isExpired && <AlertTriangle className="w-4 h-4 ml-1" />}
                  </div>
                </div>
              </div>

              {isExpired && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  CRITICAL: LICENSE EXPIRED — BLOCKED FROM TRIP ASSIGNMENT
                </div>
              )}

              {/* Status Toggle */}
              {driver.status !== "on_trip" && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Set Status
                  </p>
                  <div className="flex gap-2">
                    {DRIVER_STATUSES.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => handleStatusChange(driver.id, s.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                          driver.status === s.value
                            ? s.color + " ring-2 ring-offset-1 ring-gray-300"
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {driver.status === "on_trip" && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs text-blue-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Currently on an
                    active trip
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
