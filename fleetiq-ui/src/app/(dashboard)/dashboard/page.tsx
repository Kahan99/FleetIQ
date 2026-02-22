"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Truck, Route, Users, CreditCard, ShieldCheck, Wrench, TrendingUp,
  AlertTriangle, Loader2, Filter, Package, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { getVehicles, getDrivers, getTrips } from "@/lib/api";

/* ── KPI Card ──────────────────────────────────────────────── */
function KPICard({ title, value, icon: Icon, sub, color = "blue" }: {
  title: string; value: string | number; icon: React.FC<{ className?: string }>;
  sub?: string; color?: "green" | "orange" | "blue" | "purple" | "red";
}) {
  const theme: Record<string, { bg: string; icon: string; ring: string }> = {
    green:  { bg: "bg-[#16A34A]/10", icon: "text-[#16A34A]", ring: "ring-[#16A34A]/20" },
    orange: { bg: "bg-[#F59E0B]/10", icon: "text-[#F59E0B]", ring: "ring-[#F59E0B]/20" },
    blue:   { bg: "bg-[#2563EB]/10", icon: "text-[#2563EB]", ring: "ring-[#2563EB]/20" },
    purple: { bg: "bg-purple-500/10", icon: "text-purple-600", ring: "ring-purple-500/20" },
    red:    { bg: "bg-[#DC2626]/10", icon: "text-[#DC2626]", ring: "ring-[#DC2626]/20" },
  };
  const t = theme[color] || theme.blue;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 card-hover shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-medium text-gray-500">{title}</p>
        <div className={`w-10 h-10 rounded-xl ${t.bg} ring-1 ${t.ring} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${t.icon}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1 font-medium">{sub}</p>}
    </div>
  );
}

/* ── Manager Dashboard ─────────────────────────────────────── */
function ManagerDashboard({ data }: { data: any }) {
  const { vehicles, trips, drivers } = data;
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");

  const vehicleTypes = useMemo(() => [...new Set(vehicles.map((v: any) => v.vehicle_type))], [vehicles]);
  const regions = useMemo(() => [...new Set(vehicles.map((v: any) => v.region).filter(Boolean))], [vehicles]);

  const filteredVehicles = useMemo(() => vehicles.filter((v: any) => {
    if (filterType !== "all" && v.vehicle_type !== filterType) return false;
    if (filterStatus !== "all" && v.status !== filterStatus) return false;
    if (filterRegion !== "all" && v.region !== filterRegion) return false;
    return true;
  }), [vehicles, filterType, filterStatus, filterRegion]);

  const activeFleet = filteredVehicles.filter((v: any) => v.status === "in_use").length;
  const maintenanceAlerts = filteredVehicles.filter((v: any) => v.status === "maintenance" || v.status === "out_of_service").length;
  const utilizationRate = filteredVehicles.length > 0 ? Math.round((filteredVehicles.filter((v: any) => v.status === "in_use").length / filteredVehicles.length) * 100) : 0;
  const pendingCargo = trips.filter((t: any) => t.state === "draft").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Fleet Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time fleet operations at a glance</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20">
          <option value="all">All Types</option>
          {vehicleTypes.map((t: any) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20">
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="in_use">In Use</option>
          <option value="maintenance">Maintenance</option>
          <option value="out_of_service">Out of Service</option>
        </select>
        <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} className="px-3 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20">
          <option value="all">All Regions</option>
          {regions.map((r: any) => <option key={r} value={r}>{r}</option>)}
        </select>
        {(filterType !== "all" || filterStatus !== "all" || filterRegion !== "all") && (
          <button onClick={() => { setFilterType("all"); setFilterStatus("all"); setFilterRegion("all"); }}
            className="text-xs font-semibold text-[#2563EB] hover:underline">Clear</button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active Fleet" value={activeFleet} icon={Truck} sub={`${filteredVehicles.length} total vehicles`} color="green" />
        <KPICard title="Maintenance Alerts" value={maintenanceAlerts} icon={Wrench} sub="Vehicles in shop / OOS" color="orange" />
        <KPICard title="Utilization Rate" value={`${utilizationRate}%`} icon={TrendingUp} sub="Active / Total fleet" color="blue" />
        <KPICard title="Pending Cargo" value={pendingCargo} icon={Package} sub="Draft trips awaiting" color="purple" />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Vehicle Status</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {filteredVehicles.slice(0, 5).map((v: any) => (
              <div key={v.id} className="flex items-center justify-between px-6 py-3.5 table-row-hover">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{v.name}</p>
                  <p className="text-xs text-gray-400">{v.license_plate} {v.region ? `· ${v.region}` : ""}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  v.status === "in_use" ? "bg-[#2563EB]/10 text-[#2563EB]"
                  : v.status === "available" ? "bg-[#16A34A]/10 text-[#16A34A]"
                  : v.status === "maintenance" ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                  : "bg-[#DC2626]/10 text-[#DC2626]"
                }`}>{v.status.replace("_", " ")}</span>
              </div>
            ))}
            {filteredVehicles.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No vehicles match filters.</p>}
          </div>
        </div>
        {/* Recent Trips */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Recent Deliveries</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {trips.slice(0, 5).map((t: any) => (
              <div key={t.id} className="flex items-center justify-between px-6 py-3.5 table-row-hover">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.origin} → {t.destination}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  t.state === "completed" ? "bg-[#16A34A]/10 text-[#16A34A]"
                  : t.state === "dispatched" ? "bg-[#2563EB]/10 text-[#2563EB]"
                  : t.state === "cancelled" ? "bg-[#DC2626]/10 text-[#DC2626]"
                  : "bg-gray-100 text-gray-500"
                }`}>{t.state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dispatcher Dashboard ──────────────────────────────────── */
function DispatcherDashboard({ data }: { data: any }) {
  const { trips } = data;
  const pending = trips.filter((t: any) => t.state === "draft");
  const active = trips.filter((t: any) => t.state === "dispatched");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Dispatch Center</h1>
        <p className="text-sm text-gray-500 mt-1">Manage trips and vehicle dispatch operations</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Draft Trips" value={pending.length} icon={Route} sub="Awaiting setup" color="orange" />
        <KPICard title="On Route" value={active.length} icon={Truck} sub="Active vehicles" color="green" />
        <KPICard title="Total Managed" value={trips.length} icon={TrendingUp} sub="All time" color="blue" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-900">Dispatch Queue</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {pending.slice(0, 5).map((t: any) => (
            <div key={t.id} className="flex items-center justify-between px-6 py-4 table-row-hover">
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.origin} → {t.destination} · {t.cargo_weight}T</p>
              </div>
              <button className="px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8] shadow-sm">Prepare Dispatch</button>
            </div>
          ))}
          {pending.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No trips pending dispatch.</p>}
        </div>
      </div>
    </div>
  );
}

/* ── Safety Dashboard ──────────────────────────────────────── */
function SafetyDashboard({ data }: { data: any }) {
  const { drivers } = data;
  const onDuty = drivers.filter((d: any) => d.status === "on_duty" || d.status === "on_trip");
  const expired = drivers.filter((d: any) => d.license_expiry && new Date(d.license_expiry) < new Date());
  const avgSafety = drivers.length > 0 ? Math.round(drivers.reduce((s: number, d: any) => s + (d.safety_score || 0), 0) / drivers.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Safety Command</h1>
        <p className="text-sm text-gray-500 mt-1">Driver compliance and performance monitor</p>
      </div>
      {expired.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-[#DC2626]/5 border border-[#DC2626]/10 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#DC2626]">Compliance Alert</p>
            <p className="text-sm text-red-600 mt-0.5">{expired.length} driver(s) have expired licenses</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Active Drivers" value={onDuty.length} icon={Users} sub="On trip / standby" color="green" />
        <KPICard title="Safety Average" value={`${avgSafety}%`} icon={ShieldCheck} color="blue" />
        <KPICard title="Compliance Risk" value={expired.length} icon={AlertTriangle} color={expired.length > 0 ? "red" : "green"} />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50"><h2 className="text-sm font-bold text-gray-900">Compliance Board</h2></div>
        <div className="divide-y divide-gray-50">
          {drivers.slice(0, 8).map((d: any) => {
            const isExpired = d.license_expiry && new Date(d.license_expiry) < new Date();
            return (
              <div key={d.id} className={`flex items-center justify-between px-6 py-4 table-row-hover ${isExpired ? "bg-red-50/30" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-400">{d.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{d.name}</p>
                    <p className="text-xs text-gray-400">License: {d.license_number || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-bold ${d.safety_score >= 90 ? "text-[#16A34A]" : d.safety_score >= 70 ? "text-[#F59E0B]" : "text-[#DC2626]"}`}>{d.safety_score || 0}%</span>
                  {isExpired && <span className="text-[10px] bg-[#DC2626] text-white font-semibold px-2 py-1 rounded-md">EXPIRED</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Finance Dashboard ─────────────────────────────────────── */
function FinanceDashboard({ data }: { data: any }) {
  const { vehicles } = data;
  const totalRev = vehicles.reduce((s: number, v: any) => s + (v.total_revenue || 0), 0);
  const totalCost = vehicles.reduce((s: number, v: any) => s + (v.total_operational_cost || 0), 0);
  const avgROI = vehicles.length > 0 ? Math.round(vehicles.reduce((s: number, v: any) => s + (v.roi || 0), 0) / vehicles.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Financial Suite</h1>
        <p className="text-sm text-gray-500 mt-1">Revenue, costs, and fleet ROI analytics</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value={`₹${(totalRev/1000).toFixed(1)}k`} icon={CreditCard} sub="Net billing" color="green" />
        <KPICard title="Total Cost" value={`₹${(totalCost/1000).toFixed(1)}k`} icon={Wrench} sub="Fuel & Repair" color="orange" />
        <KPICard title="Average ROI" value={`${avgROI}%`} icon={TrendingUp} sub="Return / Investment" color="blue" />
        <KPICard title="OpEx Ratio" value={`${totalRev > 0 ? ((totalCost/totalRev)*100).toFixed(0) : 0}%`} icon={TrendingUp} sub="Cost efficiency" color="purple" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50"><h2 className="text-sm font-bold text-gray-900">Asset ROI Performance</h2></div>
          <div className="divide-y divide-gray-50">
            {vehicles.slice(0, 6).map((v: any) => (
              <div key={v.id} className="flex items-center justify-between px-6 py-3.5 table-row-hover">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{v.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{v.vehicle_type}</p>
                </div>
                <span className="text-sm font-bold text-purple-600">+{v.roi || 0}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50"><h2 className="text-sm font-bold text-gray-900">Operational Burn</h2></div>
          <div className="p-6 space-y-5">
            {[{ label: "Fuel Costs", pct: 60, color: "bg-[#2563EB]" }, { label: "Maintenance", pct: 25, color: "bg-[#F59E0B]" }, { label: "Miscellaneous", pct: 15, color: "bg-purple-500" }].map(e => (
              <div key={e.label}>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-gray-500">{e.label}</span>
                  <span className="text-gray-900 font-semibold">{e.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${e.color} rounded-full`} style={{ width: `${e.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard Page ───────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{ vehicles: any[]; trips: any[]; drivers: any[] }>({ vehicles: [], trips: [], drivers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [vData, tData, dData] = await Promise.all([getVehicles(), getTrips(), getDrivers()]);
        setData({ vehicles: vData, trips: tData, drivers: dData });
      } catch (error) { console.error("Dashboard fetch failed:", error); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  if (!user) return null;
  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32 gap-3">
      <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Synchronizing fleet data...</p>
    </div>
  );

  switch (user.role) {
    case "dispatcher": return <DispatcherDashboard data={data} />;
    case "safety_officer": return <SafetyDashboard data={data} />;
    case "financial_analyst": return <FinanceDashboard data={data} />;
    default: return <ManagerDashboard data={data} />;
  }
}
