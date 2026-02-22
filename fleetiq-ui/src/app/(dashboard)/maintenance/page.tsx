"use client";

import { useState, useEffect } from "react";
import { Wrench, Loader2, Search, Plus, X, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { getMaintenance } from "@/lib/api";

const STATUS_BADGE: Record<string, string> = {
  scheduled: "bg-[#2563EB]/10 text-[#2563EB]",
  in_progress: "bg-[#F59E0B]/10 text-[#F59E0B]",
  completed: "bg-[#16A34A]/10 text-[#16A34A]",
  cancelled: "bg-[#DC2626]/10 text-[#DC2626]",
  overdue: "bg-[#DC2626]/10 text-[#DC2626]",
};

const STATUS_ICON: Record<string, any> = {
  scheduled: Clock,
  in_progress: Wrench,
  completed: CheckCircle2,
  overdue: AlertTriangle,
};

export default function MaintenancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    (async () => { try { setRecords(await getMaintenance()); } catch {} finally { setLoading(false); } })();
  }, []);

  const filtered = records.filter(r => {
    const matchSearch = (r.service_id + r.vehicle_name + r.issue_type).toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: records.length,
    scheduled: records.filter(r => r.status === "scheduled").length,
    in_progress: records.filter(r => r.status === "in_progress").length,
    completed: records.filter(r => r.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Maintenance Logs</h1>
        <p className="text-sm text-gray-500 mt-1">Service records, inspections and repairs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: stats.total, color: "#2563EB" },
          { label: "Scheduled", value: stats.scheduled, color: "#2563EB" },
          { label: "In Progress", value: stats.in_progress, color: "#F59E0B" },
          { label: "Completed", value: stats.completed, color: "#16A34A" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-medium text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search service ID, vehicle or issue..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40" />
        </div>
        <div className="flex gap-2">
          {["all", "scheduled", "in_progress", "completed"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${filterStatus === s ? "bg-[#2563EB] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              {s === "all" ? "All" : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-16"><Loader2 className="w-7 h-7 text-[#2563EB] animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Service ID</th>
                  <th className="px-6 py-3.5">Vehicle</th>
                  <th className="px-6 py-3.5">Issue / Type</th>
                  <th className="px-6 py-3.5">Cost</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-sm text-gray-400">No maintenance records found</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className="table-row-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center"><Wrench className="w-4 h-4 text-[#F59E0B]" /></div>
                        <span className="text-sm font-semibold text-gray-900">{r.service_id || r.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.vehicle_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{r.issue_type || r.service_type || "General"}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${(r.cost || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{r.date || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[r.status] || "bg-gray-100 text-gray-500"}`}>
                        {(r.status || "").replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
