"use client";

import { TrendingUp, Download } from "lucide-react";

export default function AnalyticsPage() {
  const financialData = [
  { month: "Jan", revenue: "Rs. 17L", fuel: "Rs. 6L", maintenance: "Rs. 2L", profit: "Rs. 9L" },
  { month: "Feb", revenue: "Rs. 18L", fuel: "Rs. 6.5L", maintenance: "Rs. 1.5L", profit: "Rs. 10L" },
  { month: "Mar", revenue: "Rs. 16L", fuel: "Rs. 5.8L", maintenance: "Rs. 3L", profit: "Rs. 7.2L" },
  { month: "Apr", revenue: "Rs. 19L", fuel: "Rs. 7L", maintenance: "Rs. 2L", profit: "Rs. 10L" },
  { month: "May", revenue: "Rs. 21L", fuel: "Rs. 7.5L", maintenance: "Rs. 2.5L", profit: "Rs. 11L" }];


  const vehicles = [
  { id: "TRK-01", cost: 100 },
  { id: "TRK-02", cost: 85 },
  { id: "VAN-03", cost: 60 },
  { id: "TRK-05", cost: 45 },
  { id: "VAN-01", cost: 30 }];


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Operational Analytics & Financial Reports
          </h1>
          <p className="text-gray-500 mt-1">Data-driven decision making and fleet performance tracking.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-semibold transition-colors shadow-sm text-gray-700">
          <Download className="w-4 h-4" /> Export CSV/PDF
        </button>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[20px] p-6 border-2 border-emerald-500/20 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-24 h-24 text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-emerald-600/80 uppercase tracking-wider mb-2">Total Fuel Cost</p>
          <h3 className="text-4xl font-black text-gray-900">Rs. 2.6 L</h3>
        </div>

        <div className="bg-white rounded-[20px] p-6 border-2 border-emerald-500/20 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-24 h-24 text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-emerald-600/80 uppercase tracking-wider mb-2">Fleet ROI</p>
          <h3 className="text-4xl font-black text-gray-900">+ 12.5%</h3>
        </div>

        <div className="bg-white rounded-[20px] p-6 border-2 border-emerald-500/20 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-24 h-24 text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-emerald-600/80 uppercase tracking-wider mb-2">Utilization Rate</p>
          <h3 className="text-4xl font-black text-gray-900">82%</h3>
        </div>
      </div>

      {/* Middle Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Fuel Efficiency Trend */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Fuel Efficiency Trend (kmL)
          </h3>
          <div className="h-64 relative w-full border-l-2 border-b-2 border-gray-200 p-4">
            {/* SVG Line Chart */}
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible preserve-3d">
              {/* Grid lines */}
              <line x1="0" y1="25" x2="100" y2="25" stroke="#f3f4f6" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#f3f4f6" strokeWidth="0.5" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="#f3f4f6" strokeWidth="0.5" />

              {/* Line */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                points="0,80 20,40 40,70 60,30 80,60 100,10" />
              

              {/* Dots */}
              <circle cx="0" cy="80" r="2" fill="#2563eb" className="cursor-pointer hover:r-3 transition-all" />
              <circle cx="20" cy="40" r="2" fill="#2563eb" className="cursor-pointer hover:r-3 outline-none" />
              <circle cx="40" cy="70" r="2" fill="#2563eb" className="cursor-pointer hover:r-3 outline-none" />
              <circle cx="60" cy="30" r="2" fill="#2563eb" className="cursor-pointer hover:r-3 outline-none" />
              <circle cx="80" cy="60" r="2" fill="#2563eb" className="cursor-pointer hover:r-3 outline-none" />
              <circle cx="100" cy="10" r="2" fill="#2563eb" className="cursor-pointer hover:r-3 outline-none" />
            </svg>
            <div className="absolute bottom-[-24px] left-0 w-full flex justify-between text-xs text-gray-400 font-medium px-4">
              <span>Jan</span>
              <span>Mar</span>
              <span>Jun</span>
              <span>Sep</span>
              <span>Dec</span>
            </div>
            <div className="absolute left-[-30px] top-0 h-full flex flex-col justify-between text-xs text-gray-400 font-medium py-4">
              <span>8.0</span>
              <span>6.0</span>
              <span>4.0</span>
              <span>2.0</span>
              <span>0</span>
            </div>
          </div>
        </div>

        {/* Bar Chart: Top 5 Costliest Vehicles */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Top 5 Costliest Vehicles
          </h3>
          <div className="flex-1 flex items-end justify-around gap-2 mt-auto h-64 border-b-2 border-gray-200 pb-2 relative">
            <div className="absolute left-[-30px] top-0 h-full flex flex-col justify-between text-xs text-gray-400 font-medium pb-4">
              <span>100k</span>
              <span>75k</span>
              <span>50k</span>
              <span>25k</span>
              <span>0</span>
            </div>
            {vehicles.map((v, i) =>
            <div key={v.id} className="flex flex-col items-center gap-2 group w-full">
                <div
                className="w-full max-w-[48px] bg-rose-500/80 rounded-t-sm group-hover:bg-rose-600 transition-colors relative"
                style={{ height: `${v.cost}%` }}>
                
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Rs.{v.cost}k
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">{v.id}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Table: Financial Summary of Month */}
      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Financial Summary of Month
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Month</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Fuel Cost</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Maintenance</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {financialData.map((row, idx) =>
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    {row.month}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-emerald-600">{row.revenue}</td>
                  <td className="py-4 px-6 text-sm font-medium text-rose-600">{row.fuel}</td>
                  <td className="py-4 px-6 text-sm font-medium text-amber-600">{row.maintenance}</td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-900 text-right">{row.profit}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}