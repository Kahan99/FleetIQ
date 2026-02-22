"use client";

import { useState, useEffect } from "react";
import { Truck, Plus, X, Loader2, Ban, RotateCcw, Search } from "lucide-react";
import { getVehicles, createVehicle, toggleVehicleOOS } from "@/lib/api";

const STATUS_BADGE: Record<string, string> = {
  available: "bg-[#16A34A]/10 text-[#16A34A]",
  on_trip: "bg-[#2563EB]/10 text-[#2563EB]",
  in_use: "bg-[#2563EB]/10 text-[#2563EB]",
  in_service: "bg-gray-100 text-gray-500",
  in_shop: "bg-[#F59E0B]/10 text-[#F59E0B]",
  maintenance: "bg-[#F59E0B]/10 text-[#F59E0B]",
  out_of_service: "bg-[#DC2626]/10 text-[#DC2626]",
  inactive: "bg-gray-100 text-gray-400",
  retired: "bg-gray-100 text-gray-400",
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: "", license_plate: "", vehicle_type: "truck", max_capacity: "", odometer: "" });

  const fetchVehicles = async () => { try { setLoading(true); setVehicles(await getVehicles()); } catch {} finally { setLoading(false); } };
  useEffect(() => { fetchVehicles(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await createVehicle({ ...newVehicle, max_capacity: parseFloat(newVehicle.max_capacity) || 0, odometer: parseFloat(newVehicle.odometer) || 0 }); setIsModalOpen(false); setNewVehicle({ name: "", license_plate: "", vehicle_type: "truck", max_capacity: "", odometer: "" }); fetchVehicles(); } catch (err) { alert("Failed: " + err); }
  };

  const handleToggleOOS = async (id: number) => { try { await toggleVehicleOOS(id); fetchVehicles(); } catch (err) { alert("Failed: " + err); } };

  const filtered = vehicles.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.license_plate.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Vehicle Registry</h1>
          <p className="text-sm text-gray-500 mt-1">Fleet status, capacity, odometer and metrics</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-[#1D4ED8] shadow-sm shadow-blue-200">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search vehicles..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40" />
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
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">License Plate</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Capacity</th>
                  <th className="px-6 py-3.5">Odometer</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(v => (
                  <tr key={v.id} className={`table-row-hover ${v.status === "out_of_service" ? "opacity-60" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#2563EB]/10 rounded-lg flex items-center justify-center"><Truck className="w-4 h-4 text-[#2563EB]" /></div>
                        <span className="text-sm font-semibold text-gray-900">{v.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{v.license_plate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{v.vehicle_type}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{v.max_capacity}T</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{(v.odometer || 0).toLocaleString()} km</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[v.status] || "bg-gray-100 text-gray-500"}`}>
                        {(v.status || "").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleToggleOOS(v.id)} className={`text-xs font-medium px-3 py-1.5 rounded-lg ${v.status === "out_of_service" ? "bg-[#16A34A]/10 text-[#16A34A] hover:bg-[#16A34A]/20" : "bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626]/20"}`}>
                        {v.status === "out_of_service" ? "Restore" : "Mark OOS"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">New Vehicle</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Vehicle Name</label>
                <input required type="text" className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" placeholder="e.g. Truck Alpha" value={newVehicle.name} onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">License Plate</label>
                <input required type="text" className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" placeholder="GJ-01-XX-0000" value={newVehicle.license_plate} onChange={e => setNewVehicle({ ...newVehicle, license_plate: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Type</label>
                  <select className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" value={newVehicle.vehicle_type} onChange={e => setNewVehicle({ ...newVehicle, vehicle_type: e.target.value })}>
                    <option value="truck">Truck</option><option value="van">Van</option><option value="bike">Bike</option><option value="car">Car</option><option value="bus">Bus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Capacity (T)</label>
                  <input type="number" className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" placeholder="10" value={newVehicle.max_capacity} onChange={e => setNewVehicle({ ...newVehicle, max_capacity: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Odometer</label>
                  <input type="number" className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20" placeholder="0" value={newVehicle.odometer} onChange={e => setNewVehicle({ ...newVehicle, odometer: e.target.value })} />
                </div>
              </div>
              <button className="w-full bg-[#2563EB] text-white font-semibold py-3 rounded-xl hover:bg-[#1D4ED8] shadow-sm flex items-center justify-center gap-2 mt-2">
                <Plus className="w-4 h-4" /> Create Vehicle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
