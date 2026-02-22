"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Fuel,
  Wrench,
  DollarSign,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  BarChart3,
  Truck,
} from "lucide-react";
import { getAnalytics } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAnalytics();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── CSV Export ──────────────────────────────────────────────────
  const exportCSV = () => {
    if (!data) return;
    const headers = [
      "Vehicle",
      "License Plate",
      "Type",
      "Odometer (km)",
      "Revenue (₹)",
      "Fuel Cost (₹)",
      "Fuel (L)",
      "Maintenance Cost (₹)",
      "Total OpCost (₹)",
      "Fuel Efficiency (km/L)",
      "ROI (%)",
      "Trips Completed",
    ];
    const rows = data.vehicleAnalytics.map((v: any) => [
      v.name,
      v.license_plate,
      v.vehicle_type,
      v.odometer,
      v.revenue,
      v.totalFuelCost,
      v.totalFuelLiters,
      v.totalMaintenanceCost,
      v.totalOperationalCost,
      v.fuelEfficiency,
      v.roi,
      v.tripsCompleted,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r: any[]) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FleetIQ_analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── PDF Export (printable HTML) ─────────────────────────────────
  const exportPDF = () => {
    if (!data) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const tableRows = data.vehicleAnalytics
      .map(
        (v: any) => `
            <tr>
                <td style="padding:8px;border:1px solid #ddd;">${v.name}</td>
                <td style="padding:8px;border:1px solid #ddd;">${v.license_plate}</td>
                <td style="padding:8px;border:1px solid #ddd;">${v.odometer.toLocaleString()} km</td>
                <td style="padding:8px;border:1px solid #ddd;">₹${v.revenue.toLocaleString()}</td>
                <td style="padding:8px;border:1px solid #ddd;">₹${v.totalFuelCost.toLocaleString()}</td>
                <td style="padding:8px;border:1px solid #ddd;">₹${v.totalMaintenanceCost.toLocaleString()}</td>
                <td style="padding:8px;border:1px solid #ddd;">₹${v.totalOperationalCost.toLocaleString()}</td>
                <td style="padding:8px;border:1px solid #ddd;">${v.fuelEfficiency} km/L</td>
                <td style="padding:8px;border:1px solid #ddd;">${v.roi}%</td>
            </tr>
        `,
      )
      .join("");

    printWindow.document.write(`
            <html><head><title>FleetIQ Analytics Report</title>
            <style>body{font-family:Arial,sans-serif;padding:40px}table{border-collapse:collapse;width:100%}th{background:#1e40af;color:white;padding:10px;border:1px solid #ddd}h1{color:#1e40af}h3{margin-top:30px;color:#374151}.summary{display:flex;gap:20px;margin:20px 0}.card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;flex:1;text-align:center}.card .val{font-size:24px;font-weight:bold;color:#1e40af}.card .label{font-size:12px;color:#6b7280;text-transform:uppercase}</style>
            </head><body>
            <h1>FleetIQ — Operational Analytics Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <div class="summary">
                <div class="card"><div class="val">₹${data.totals.totalRevenue.toLocaleString()}</div><div class="label">Total Revenue</div></div>
                <div class="card"><div class="val">₹${data.totals.totalOperationalCost.toLocaleString()}</div><div class="label">Total OpCost</div></div>
                <div class="card"><div class="val">${data.totals.totalFuelLiters.toLocaleString()}L</div><div class="label">Total Fuel</div></div>
                <div class="card"><div class="val">${data.totals.completedTrips}</div><div class="label">Trips Completed</div></div>
            </div>
            <h3>Vehicle-wise Breakdown</h3>
            <table><thead><tr>
                <th>Vehicle</th><th>License</th><th>Odometer</th><th>Revenue</th>
                <th>Fuel Cost</th><th>Maint. Cost</th><th>Total OpCost</th>
                <th>Efficiency</th><th>ROI</th>
            </tr></thead><tbody>${tableRows}</tbody></table>
            <p style="margin-top:30px;color:#9ca3af;font-size:12px">FleetIQ Analytics — Confidential</p>
            </body></html>
        `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-40 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="font-black text-gray-400 uppercase tracking-widest text-sm">
          Computing analytics...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-400 p-20">
        Failed to load analytics data.
      </div>
    );
  }

  const { vehicleAnalytics, totals } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Operational Analytics
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Fuel efficiency, vehicle ROI, and financial reports.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-100"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Revenue"
          value={`₹${(totals.totalRevenue / 1000).toFixed(1)}k`}
          icon={DollarSign}
          sub="Cumulative fleet billing"
          color="purple"
        />
        <SummaryCard
          title="Total Fuel Cost"
          value={`₹${(totals.totalFuelCost / 1000).toFixed(1)}k`}
          icon={Fuel}
          sub={`${totals.totalFuelLiters.toLocaleString()} liters total`}
          color="amber"
        />
        <SummaryCard
          title="Maintenance Cost"
          value={`₹${(totals.totalMaintenanceCost / 1000).toFixed(1)}k`}
          icon={Wrench}
          sub="Cumulative service spend"
          color="red"
        />
        <SummaryCard
          title="Fleet OpCost"
          value={`₹${(totals.totalOperationalCost / 1000).toFixed(1)}k`}
          icon={TrendingUp}
          sub="Fuel + Maintenance combined"
          color="blue"
        />
      </div>

      {/* Vehicle Analytics Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-gray-900">
              Vehicle Performance Breakdown
            </h2>
          </div>
          <p className="text-sm text-gray-400 font-bold">
            {vehicleAnalytics.length} vehicles
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Odometer</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Fuel Cost</th>
                <th className="px-6 py-4">Maint. Cost</th>
                <th className="px-6 py-4">Total OpCost</th>
                <th className="px-6 py-4">Fuel Efficiency</th>
                <th className="px-6 py-4">ROI</th>
                <th className="px-6 py-4">Trips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicleAnalytics.map((v: any) => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm">
                          {v.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {v.license_plate}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-700">
                    {v.odometer.toLocaleString()} km
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-green-700">
                    ₹{v.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-amber-600">
                    ₹{v.totalFuelCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-red-600">
                    ₹{v.totalMaintenanceCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-gray-900">
                    ₹{v.totalOperationalCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`text-sm font-black ${v.fuelEfficiency === "N/A" ? "text-gray-400" : "text-blue-600"}`}
                    >
                      {v.fuelEfficiency}{" "}
                      {v.fuelEfficiency !== "N/A" ? "km/L" : ""}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`text-sm font-black px-2 py-1 rounded-lg ${
                        parseFloat(v.roi) > 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {v.roi}%
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-700">
                    {v.tripsCompleted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Formula Reference */}
      <div className="bg-blue-50 rounded-3xl border border-blue-100 p-8">
        <h3 className="font-black text-blue-900 mb-2">
          ROI Calculation Formula
        </h3>
        <p className="text-blue-700 font-mono text-sm">
          ROI = ((Revenue - (Maintenance + Fuel)) / Acquisition Cost) × 100
        </p>
        <p className="text-blue-600 text-xs mt-2 font-medium">
          This metric shows return on each vehicle relative to its purchase
          cost.
        </p>
      </div>
    </div>
  );
}

// ── Summary Card Component ──────────────────────────────────────
function SummaryCard({
  title,
  value,
  icon: Icon,
  sub,
  color,
}: {
  title: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  sub: string;
  color: "blue" | "purple" | "amber" | "red";
}) {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      val: "text-blue-700",
      border: "border-blue-100",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      val: "text-purple-700",
      border: "border-purple-100",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      val: "text-amber-700",
      border: "border-amber-100",
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-600",
      val: "text-red-700",
      border: "border-red-100",
    },
  }[color];

  return (
    <div className={`${colors.bg} rounded-[2rem] border ${colors.border} p-6`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
          {title}
        </p>
      </div>
      <p className={`text-3xl font-black ${colors.val}`}>{value}</p>
      <p className="text-xs font-bold text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
