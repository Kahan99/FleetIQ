"use client";

import { BarChart3, TrendingUp, DollarSign, Fuel, Map, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function ChartPlaceholder({ label }: { label: string }) {
  return (
    <div className="h-64 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <BarChart3 className="w-6 h-6 text-blue-400" />
      </div>
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      <p className="text-xs text-gray-400 mt-1 max-w-[200px]">This visualization is processing real-time fleet data.</p>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          Global Analytics
        </h1>
        <p className="text-gray-500 mt-1">Advanced insights into fleet efficiency and financial performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign className="w-20 h-20 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Net Revenue</span>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-gray-900">₹45.2L</h3>
              <Badge variant="success" className="mb-1.5">+12.4%</Badge>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">Compared to last quarter</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Fuel className="w-20 h-20 text-rose-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fuel Efficiency</span>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-gray-900">3.8 km/L</h3>
              <Badge variant="danger" className="mb-1.5">-2.1%</Badge>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">Seasonal variation suspected</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Map className="w-20 h-20 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Trip Distance</span>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-gray-900">242 km</h3>
              <Badge variant="info" className="mb-1.5">+4.2%</Badge>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">Interstate routes increasing</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Fuel Efficiency Trends" subtitle="Line chart showing performance across the last 6 months.">
          <ChartPlaceholder label="Fuel Efficiency Over Time" />
          <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Best Performing Month</p>
                <p className="text-xs text-gray-500">September 2024 (4.2 km/L)</p>
              </div>
            </div>
            <button className="text-xs font-bold text-blue-600 hover:underline">Download Report</button>
          </div>
        </Card>

        <Card title="Top Performing Artifacts" subtitle="Bar chart comparing fleet utilization by vehicle category.">
          <ChartPlaceholder label="Utilization by Vehicle Type" />
          <div className="mt-6 space-y-3">
            {[
              { type: "Heavy Duty Truck", val: 92, status: "High" },
              { type: "Standard Delivery", val: 78, status: "Normal" },
              { type: "Refrigerated Van", val: 85, status: "Optimized" }
            ].map(item => (
              <div key={item.type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{item.type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.val}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-900">{item.val}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Revenue vs Operational Cost" subtitle="Monthly financial breakdown of fleet operations.">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-4 rounded-3xl bg-gray-50/50 border border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Q3 Revenue</p>
            <p className="text-xl font-bold text-gray-900">₹1.2 Cr</p>
          </div>
          <div className="p-4 rounded-3xl bg-gray-50/50 border border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Maintenance Burn</p>
            <p className="text-xl font-bold text-gray-900">₹14.5L</p>
          </div>
          <div className="p-4 rounded-3xl bg-gray-50/50 border border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Fuel Expense</p>
            <p className="text-xl font-bold text-gray-900">₹32.1L</p>
          </div>
          <div className="p-4 rounded-3xl bg-blue-600 border border-blue-500 shadow-xl shadow-blue-100">
            <p className="text-xs text-blue-100 font-bold uppercase mb-1">Operating Profit</p>
            <p className="text-xl font-bold text-white">₹73.4L</p>
          </div>
        </div>
        <ChartPlaceholder label="Monthly Financial Trends" />
      </Card>
    </div>
  );
}
