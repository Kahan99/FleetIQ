"use client";

import { useState, useEffect } from "react";
import { BarChart3, Loader2, TrendingUp, DollarSign, Truck, Fuel, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getAnalytics } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => { try { setData(await getAnalytics()); } catch {} finally { setLoading(false); } })();
  }, []);

  if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="w-7 h-7 text-[#2563EB] animate-spin" /></div>;
  if (!data) return <div className="text-center text-gray-400 p-20">Failed to load analytics</div>;

  const kpis = [
    { label: "Total Revenue", value: `$${(data.total_revenue || 0).toLocaleString()}`, change: "+12.5%", up: true, color: "#16A34A", bg: "bg-[#16A34A]/10", icon: DollarSign },
    { label: "Total Cost", value: `$${(data.total_cost || 0).toLocaleString()}`, change: "-3.2%", up: false, color: "#DC2626", bg: "bg-[#DC2626]/10", icon: TrendingUp },
    { label: "Avg Fuel Efficiency", value: `${data.avg_fuel_efficiency || 0} km/L`, change: "+5.1%", up: true, color: "#2563EB", bg: "bg-[#2563EB]/10", icon: Fuel },
    { label: "Fleet Utilization", value: `${data.fleet_utilization || 0}%`, change: "+8.7%", up: true, color: "#F59E0B", bg: "bg-[#F59E0B]/10", icon: Truck },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Analytics & Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Fleet performance insights and cost analysis</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${k.bg} rounded-xl flex items-center justify-center`}>
                <k.icon className="w-5 h-5" style={{ color: k.color }} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${k.up ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {k.change}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-400">{k.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Efficiency Trend */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Fuel Efficiency Trend</h3>
          <div className="space-y-3">
            {(data.fuel_trend || [
              { month: "Jan", value: 8.2 }, { month: "Feb", value: 8.5 }, { month: "Mar", value: 9.1 },
              { month: "Apr", value: 8.8 }, { month: "May", value: 9.4 }, { month: "Jun", value: 9.7 },
            ]).map((m: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-8">{m.month}</span>
                <div className="flex-1 h-7 bg-gray-50 rounded-lg overflow-hidden relative">
                  <div className="h-full rounded-lg transition-all duration-700" style={{ width: `${(m.value / 12) * 100}%`, background: `linear-gradient(90deg, #2563EB, #60A5FA)` }} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-500">{m.value} km/L</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vehicles by Revenue */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Top Vehicles by Revenue</h3>
          <div className="space-y-3">
            {(data.top_vehicles || [
              { name: "Truck Alpha", revenue: 12500 }, { name: "Truck Bravo", revenue: 11200 }, { name: "Van Charlie", revenue: 9800 },
              { name: "Truck Delta", revenue: 8500 }, { name: "Van Echo", revenue: 7200 },
            ]).map((v: any, i: number) => {
              const max = Math.max(...(data.top_vehicles || [{ revenue: 12500 }]).map((x: any) => x.revenue));
              const colors = ["#16A34A", "#2563EB", "#F59E0B", "#8B5CF6", "#DC2626"];
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-24 truncate font-medium">{v.name}</span>
                  <div className="flex-1 h-7 bg-gray-50 rounded-lg overflow-hidden relative">
                    <div className="h-full rounded-lg transition-all duration-700" style={{ width: `${(v.revenue / max) * 100}%`, backgroundColor: colors[i % colors.length] }} />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-500">${v.revenue.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Revenue vs Cost Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-sm font-bold text-gray-900">Monthly Revenue vs Cost</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-3.5">Month</th>
                <th className="px-6 py-3.5">Revenue</th>
                <th className="px-6 py-3.5">Cost</th>
                <th className="px-6 py-3.5">Profit</th>
                <th className="px-6 py-3.5">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(data.monthly_breakdown || [
                { month: "January", revenue: 45000, cost: 32000 },
                { month: "February", revenue: 48000, cost: 31000 },
                { month: "March", revenue: 52000, cost: 35000 },
                { month: "April", revenue: 49000, cost: 33000 },
                { month: "May", revenue: 55000, cost: 34000 },
                { month: "June", revenue: 58000, cost: 36000 },
              ]).map((m: any, i: number) => {
                const profit = m.revenue - m.cost;
                const margin = ((profit / m.revenue) * 100).toFixed(1);
                return (
                  <tr key={i} className="table-row-hover">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{m.month}</td>
                    <td className="px-6 py-4 text-sm text-[#16A34A] font-semibold">${m.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-[#DC2626] font-semibold">${m.cost.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">${profit.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${parseFloat(margin) >= 30 ? "bg-[#16A34A]/10 text-[#16A34A]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
