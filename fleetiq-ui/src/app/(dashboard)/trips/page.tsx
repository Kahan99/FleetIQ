"use client";

import { useState, useEffect } from "react";
import { Navigation, Plus, X, Loader2, Send, CheckCircle2, XCircle, Clock, Search, MapPin, ArrowRight } from "lucide-react";
import { getTrips, getVehicles, getDrivers, createTrip, dispatchTrip, completeTrip, cancelTrip } from "@/lib/api";

const TRIP_BADGE: Record<string, string> = {
  draft: "bg-gray-100 text-gray-500",
  dispatched: "bg-[#2563EB]/10 text-[#2563EB]",
  in_progress: "bg-[#F59E0B]/10 text-[#F59E0B]",
  completed: "bg-[#16A34A]/10 text-[#16A34A]",
  cancelled: "bg-[#DC2626]/10 text-[#DC2626]",
};

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ origin: "", destination: "", vehicle_id: "", driver_id: "", cargo_weight: "", notes: "" });

  const fetchAll = async () => {
    try { setLoading(true); const [t, v, d] = await Promise.all([getTrips(), getVehicles(), getDrivers()]); setTrips(t); setVehicles(v); setDrivers(d); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.origin || !form.destination || !form.vehicle_id || !form.driver_id) return alert("Fill all required fields");
    try { await createTrip({ ...form, vehicle_id: +form.vehicle_id, driver_id: +form.driver_id, cargo_weight: parseFloat(form.cargo_weight) || 0 }); setForm({ origin: "", destination: "", vehicle_id: "", driver_id: "", cargo_weight: "", notes: "" }); fetchAll(); } catch (err) { alert("Failed: " + err); }
  };

  const filtered = trips.filter(t => (t.origin + t.destination + t.name).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Trip Dispatcher</h1>
        <p className="text-sm text-gray-500 mt-1">Schedule and manage fleet deliveries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left - New Trip Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-6">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Plus className="w-4 h-4 text-[#2563EB]" /> New Trip</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Origin</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#16A34A]" />
                    <input required className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" placeholder="Starting location" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Destination</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#DC2626]" />
                    <input required className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" placeholder="Drop-off location" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Vehicle</label>
                  <select required className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" value={form.vehicle_id} onChange={e => setForm({ ...form, vehicle_id: e.target.value })}>
                    <option value="">Select...</option>
                    {vehicles.filter(v => v.status === "available").map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Driver</label>
                  <select required className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" value={form.driver_id} onChange={e => setForm({ ...form, driver_id: e.target.value })}>
                    <option value="">Select...</option>
                    {drivers.filter(d => d.status === "active").map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Cargo Weight (T)</label>
                <input type="number" step="0.1" className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" placeholder="0" value={form.cargo_weight} onChange={e => setForm({ ...form, cargo_weight: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes</label>
                <textarea className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 resize-none" rows={2} placeholder="Optional notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <button className="w-full bg-[#2563EB] text-white font-semibold py-3 rounded-xl hover:bg-[#1D4ED8] shadow-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Create & Dispatch
              </button>
            </form>
          </div>
        </div>

        {/* Right - Trip List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search trips..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40" />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-16"><Loader2 className="w-7 h-7 text-[#2563EB] animate-spin" /></div>
          ) : (
            <div className="space-y-3">
              {filtered.length === 0 && <p className="text-center text-sm text-gray-400 py-12">No trips yet</p>}
              {filtered.map(t => (
                <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-gray-400">{t.name}</span>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${TRIP_BADGE[t.status] || "bg-gray-100 text-gray-500"}`}>{(t.status || "").replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="font-medium truncate">{t.origin}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                        <span className="font-medium truncate">{t.destination}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs text-gray-400">
                        {t.vehicle_name && <span>Vehicle: <span className="text-gray-600">{t.vehicle_name}</span></span>}
                        {t.driver_name && <span>Driver: <span className="text-gray-600">{t.driver_name}</span></span>}
                        {t.cargo_weight > 0 && <span>Cargo: <span className="text-gray-600">{t.cargo_weight}T</span></span>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {t.status === "draft" && (
                        <button onClick={() => { dispatchTrip(t.id).then(fetchAll); }} className="px-3 py-1.5 text-xs font-medium bg-[#2563EB]/10 text-[#2563EB] rounded-lg hover:bg-[#2563EB]/20 flex items-center gap-1">
                          <Send className="w-3 h-3" /> Dispatch
                        </button>
                      )}
                      {(t.status === "dispatched" || t.status === "in_progress") && (
                        <button onClick={() => { completeTrip(t.id).then(fetchAll); }} className="px-3 py-1.5 text-xs font-medium bg-[#16A34A]/10 text-[#16A34A] rounded-lg hover:bg-[#16A34A]/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Complete
                        </button>
                      )}
                      {t.status !== "completed" && t.status !== "cancelled" && (
                        <button onClick={() => { cancelTrip(t.id).then(fetchAll); }} className="px-3 py-1.5 text-xs font-medium bg-[#DC2626]/10 text-[#DC2626] rounded-lg hover:bg-[#DC2626]/20 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
