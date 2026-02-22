"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Truck,
  Route,
  Users,
  CreditCard,
  ShieldCheck,
  Wrench,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Filter,
  Package,
} from "lucide-react";
import { getVehicles, getDrivers, getTrips } from "@/lib/api";

// ── Shared sub-components ────────────────────────────────────
function StatCard({
  title,
  value,
  icon: Icon,
  sub,
  color = "blue",
}: {
  title: string;
  value: string | number;
  icon: React.FC<{ className?: string }>;
  sub?: string;
  color?: "blue" | "emerald" | "amber" | "purple" | "red";
}) {
  const colors = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", val: "text-blue-700" },
    emerald: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      val: "text-emerald-700",
    },
    amber: { bg: "bg-amber-50", icon: "text-amber-600", val: "text-amber-700" },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      val: "text-purple-700",
    },
    red: { bg: "bg-red-50", icon: "text-red-600", val: "text-red-700" },
  }[color];
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 ${colors.bg} rounded-2xl flex items-center justify-center mb-4`}
      >
        <Icon className={`w-6 h-6 ${colors.icon}`} />
      </div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      <p className={`text-3xl font-black ${colors.val}`}>{value}</p>
      {sub && <p className="text-xs font-bold text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ── Role-Specific Views ──────────────────────────────────────

function ManagerDashboard({ data }: { data: any }) {
  const { vehicles, trips, drivers } = data;
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");

  // Derive unique filter options
  const vehicleTypes = useMemo(
    () => [...new Set(vehicles.map((v: any) => v.vehicle_type))],
    [vehicles],
  );
  const regions = useMemo(
    () => [...new Set(vehicles.map((v: any) => v.region).filter(Boolean))],
    [vehicles],
  );

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v: any) => {
      if (filterType !== "all" && v.vehicle_type !== filterType) return false;
      if (filterStatus !== "all" && v.status !== filterStatus) return false;
      if (filterRegion !== "all" && v.region !== filterRegion) return false;
      return true;
    });
  }, [vehicles, filterType, filterStatus, filterRegion]);

  // KPIs based on filtered set
  const activeFleet = filteredVehicles.filter(
    (v: any) => v.status === "in_use",
  ).length;
  const maintenanceAlerts = filteredVehicles.filter(
    (v: any) => v.status === "maintenance" || v.status === "out_of_service",
  ).length;
  const utilizationRate =
    filteredVehicles.length > 0
      ? Math.round(
          (filteredVehicles.filter((v: any) => v.status === "in_use").length /
            filteredVehicles.length) *
            100,
        )
      : 0;
  const pendingCargo = trips.filter((t: any) => t.state === "draft").length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Fleet Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Complete fleet operations at a glance.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">
            Filters
          </span>
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="all">All Types</option>
          {vehicleTypes.map((t: any) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="in_use">In Use</option>
          <option value="maintenance">Maintenance</option>
          <option value="out_of_service">Out of Service</option>
        </select>
        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="all">All Regions</option>
          {regions.map((r: any) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {(filterType !== "all" ||
          filterStatus !== "all" ||
          filterRegion !== "all") && (
          <button
            onClick={() => {
              setFilterType("all");
              setFilterStatus("all");
              setFilterRegion("all");
            }}
            className="text-xs font-bold text-blue-600 underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Key KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Fleet"
          value={activeFleet}
          icon={Truck}
          sub={`${filteredVehicles.length} total vehicles`}
          color="blue"
        />
        <StatCard
          title="Maintenance Alerts"
          value={maintenanceAlerts}
          icon={Wrench}
          sub="Vehicles in shop / OOS"
          color={maintenanceAlerts > 0 ? "red" : "emerald"}
        />
        <StatCard
          title="Utilization Rate"
          value={`${utilizationRate}%`}
          icon={TrendingUp}
          sub="Active / Total fleet"
          color="emerald"
        />
        <StatCard
          title="Pending Cargo"
          value={pendingCargo}
          icon={Package}
          sub="Draft trips awaiting"
          color="amber"
        />
      </div>

      {/* Vehicle Status + Recent Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-gray-900 mb-6">
            Vehicle Status
          </h2>
          <div className="space-y-4">
            {filteredVehicles.slice(0, 5).map((v: any) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
              >
                <div>
                  <p className="font-bold text-gray-900 text-sm">{v.name}</p>
                  <p className="text-xs text-gray-400 font-medium">
                    {v.license_plate} {v.region ? `• ${v.region}` : ""}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${
                    v.status === "in_use"
                      ? "bg-blue-100 text-blue-700"
                      : v.status === "available"
                        ? "bg-green-100 text-green-700"
                        : v.status === "maintenance"
                          ? "bg-red-100 text-red-700"
                          : v.status === "out_of_service"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {v.status.replace("_", " ")}
                </span>
              </div>
            ))}
            {filteredVehicles.length === 0 && (
              <p className="text-center text-gray-400 py-8 font-bold">
                No vehicles match filters.
              </p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-gray-900 mb-6">
            Recent Deliveries
          </h2>
          <div className="space-y-4">
            {trips.slice(0, 5).map((t: any) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
              >
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400 font-medium">
                    {t.origin} → {t.destination}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${
                    t.state === "completed"
                      ? "bg-green-50 text-green-600"
                      : t.state === "dispatched"
                        ? "bg-blue-50 text-blue-600"
                        : t.state === "cancelled"
                          ? "bg-red-50 text-red-600"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t.state}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DispatcherDashboard({ data }: { data: any }) {
  const { trips } = data;
  const pendingTrips = trips.filter((t: any) => t.state === "draft");
  const activeTrips = trips.filter((t: any) => t.state === "dispatched");

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Dispatch Center</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Manage trips and vehicle dispatch operations.
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            Dispatcher View
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Draft Trips"
          value={pendingTrips.length}
          icon={Route}
          sub="Awaiting setup"
          color="amber"
        />
        <StatCard
          title="On Route"
          value={activeTrips.length}
          icon={Truck}
          sub="Active vehicles"
          color="emerald"
        />
        <StatCard
          title="Total Managed"
          value={trips.length}
          icon={TrendingUp}
          sub="All time"
          color="blue"
        />
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-black text-gray-900 mb-6">
          Dispatch Queue
        </h2>
        <div className="space-y-3">
          {pendingTrips.slice(0, 5).map((t: any) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-emerald-50/50 transition-colors group"
            >
              <div>
                <p className="font-black text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-400 font-medium">
                  {t.origin} → {t.destination} • {t.cargo_weight}T
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600">
                  DRAFT
                </span>
                <button className="px-5 py-3 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                  Prepare Dispatch
                </button>
              </div>
            </div>
          ))}
          {pendingTrips.length === 0 && (
            <p className="text-center text-gray-400 py-10 font-bold">
              No trips pending dispatch.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SafetyDashboard({ data }: { data: any }) {
  const { drivers } = data;
  const onDuty = drivers.filter(
    (d: any) => d.status === "on_duty" || d.status === "on_trip",
  );
  const expiredDrivers = drivers.filter(
    (d: any) => d.license_expiry && new Date(d.license_expiry) < new Date(),
  );
  const avgSafety =
    drivers.length > 0
      ? Math.round(
          drivers.reduce((s: number, d: any) => s + (d.safety_score || 0), 0) /
            drivers.length,
        )
      : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Safety Command</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Driver compliance and performance monitor.
          </p>
        </div>
        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
            Safety View
          </p>
        </div>
      </div>
      {expiredDrivers.length > 0 && (
        <div className="flex items-start gap-4 p-6 bg-red-50 border border-red-100 rounded-[2rem] animate-pulse">
          <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
          <div>
            <p className="font-black text-red-700 text-lg">
              CRITICAL COMPLIANCE ALERT
            </p>
            <p className="text-red-600 font-bold mt-1">
              {expiredDrivers.length} driver(s) have expired licenses:{" "}
              {expiredDrivers
                .slice(0, 3)
                .map((d: any) => d.name)
                .join(", ")}
              {expiredDrivers.length > 3 && "..."}
            </p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Drivers"
          value={onDuty.length}
          icon={Users}
          sub="On trip / standby"
          color="emerald"
        />
        <StatCard
          title="Safety Average"
          value={`${avgSafety}%`}
          icon={ShieldCheck}
          color="blue"
        />
        <StatCard
          title="Compliance Risk"
          value={expiredDrivers.length}
          icon={AlertTriangle}
          color={expiredDrivers.length > 0 ? "red" : "emerald"}
        />
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-black text-gray-900 mb-6">
          Compliance Board
        </h2>
        <div className="space-y-4">
          {drivers.slice(0, 8).map((d: any) => {
            const expired =
              d.license_expiry && new Date(d.license_expiry) < new Date();
            return (
              <div
                key={d.id}
                className={`flex items-center justify-between p-5 rounded-2xl ${expired ? "bg-red-50/50 border border-red-100" : "bg-gray-50"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-gray-400">
                    {d.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{d.name}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      License: {d.license_number || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p
                      className={`text-xl font-black ${d.safety_score >= 90 ? "text-emerald-600" : d.safety_score >= 70 ? "text-amber-500" : "text-red-500"}`}
                    >
                      {d.safety_score || 0}%
                    </p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Score
                    </p>
                  </div>
                  {expired && (
                    <span className="text-[10px] bg-red-600 text-white font-black px-3 py-1.5 rounded-xl">
                      EXPIRED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FinanceDashboard({ data }: { data: any }) {
  const { vehicles } = data;
  const totalRev = vehicles.reduce(
    (s: number, v: any) => s + (v.total_revenue || 0),
    0,
  );
  const totalCost = vehicles.reduce(
    (s: number, v: any) => s + (v.total_operational_cost || 0),
    0,
  );
  const avgROI =
    vehicles.length > 0
      ? Math.round(
          vehicles.reduce((s: number, v: any) => s + (v.roi || 0), 0) /
            vehicles.length,
        )
      : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Financial Suite</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Revenue, costs, and fleet ROI analytics.
          </p>
        </div>
        <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl">
          <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">
            Finance View
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${(totalRev / 1000).toFixed(1)}k`}
          icon={CreditCard}
          sub="Net billing"
          color="purple"
        />
        <StatCard
          title="Total Cost"
          value={`₹${(totalCost / 1000).toFixed(1)}k`}
          icon={Wrench}
          sub="Fuel & Repair"
          color="amber"
        />
        <StatCard
          title="Average ROI"
          value={`${avgROI}%`}
          icon={TrendingUp}
          sub="Return / Investment"
          color="emerald"
        />
        <StatCard
          title="OpEx Ratio"
          value={`${totalRev > 0 ? ((totalCost / totalRev) * 100).toFixed(0) : 0}%`}
          icon={TrendingUp}
          sub="Cost efficiency"
          color="blue"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-gray-900 mb-6">
            Asset ROI Performance
          </h2>
          <div className="space-y-4">
            {vehicles.slice(0, 6).map((v: any) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
              >
                <div>
                  <p className="font-black text-gray-900 text-sm">{v.name}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    {v.vehicle_type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-purple-600 text-sm">
                    +{v.roi || 0}%
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    ROI
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-gray-900 mb-6">
            Operational Burn
          </h2>
          <div className="space-y-6">
            {[
              { label: "Fuel Costs", pct: 60, color: "bg-blue-500" },
              { label: "Maintenance", pct: 25, color: "bg-amber-500" },
              { label: "Miscellaneous", pct: 15, color: "bg-purple-500" },
            ].map((e) => (
              <div key={e.label}>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                  <span className="text-gray-500">{e.label}</span>
                  <span className="text-gray-900">{e.pct}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${e.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${e.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard Page ──────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{
    vehicles: any[];
    trips: any[];
    drivers: any[];
  }>({ vehicles: [], trips: [], drivers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [vData, tData, dData] = await Promise.all([
          getVehicles(),
          getTrips(),
          getDrivers(),
        ]);
        setData({ vehicles: vData, trips: tData, drivers: dData });
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (!user) return null;
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-40 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="font-black text-gray-400 uppercase tracking-widest text-sm">
          Synchronizing with Odoo...
        </p>
      </div>
    );

  switch (user.role) {
    case "dispatcher":
      return <DispatcherDashboard data={data} />;
    case "safety_officer":
      return <SafetyDashboard data={data} />;
    case "financial_analyst":
      return <FinanceDashboard data={data} />;
    default:
      return <ManagerDashboard data={data} />;
  }
}
