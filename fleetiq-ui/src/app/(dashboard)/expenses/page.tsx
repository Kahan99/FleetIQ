"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CreditCard,
  TrendingDown,
  TrendingUp,
  Plus,
  X,
  Loader2,
  Truck,
  Wrench,
} from "lucide-react";
import {
  getExpenses,
  getVehicles,
  getTrips,
  getMaintenance,
  createExpense,
} from "@/lib/api";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [newExpense, setNewExpense] = useState({
    vehicle_id: "",
    trip_id: "",
    liters: "",
    cost: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expData, vData, tData, mData] = await Promise.all([
        getExpenses(),
        getVehicles(),
        getTrips(),
        getMaintenance(),
      ]);
      setExpenses(expData);
      setVehicles(vData);
      setTrips(tData);
      setMaintenance(mData);
    } catch (error) {
      console.error("Failed to fetch expense data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      await createExpense({
        vehicle_id: parseInt(newExpense.vehicle_id),
        trip_id: newExpense.trip_id ? parseInt(newExpense.trip_id) : undefined,
        liters: parseFloat(newExpense.liters) || 0,
        cost: parseFloat(newExpense.cost),
      });
      setIsModalOpen(false);
      setNewExpense({ vehicle_id: "", trip_id: "", liters: "", cost: "" });
      fetchData();
    } catch (error) {
      alert("Failed to record expense: " + error);
    } finally {
      setIsProcessing(false);
    }
  };

  const total = expenses.reduce((s, e) => s + e.cost, 0);
  const fuelLiters = expenses.reduce((s, e) => s + (e.liters || 0), 0);

  // Per-vehicle operational cost (Fuel + Maintenance)
  const vehicleOpCost = useMemo(() => {
    return vehicles
      .map((v) => {
        const fuelCost = expenses
          .filter((e) => e.vehicle_id === v.id || e.vehicle === v.name)
          .reduce((s, e) => s + e.cost, 0);
        const maintCost = maintenance
          .filter((m: any) => m.vehicle_id === v.id || m.vehicle === v.name)
          .reduce((s: number, m: any) => s + (m.cost || 0), 0);
        return { ...v, fuelCost, maintCost, totalOpCost: fuelCost + maintCost };
      })
      .sort((a, b) => b.totalOpCost - a.totalOpCost);
  }, [vehicles, expenses, maintenance]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Expenses & Fuel</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Track operational costs and fuel efficiency metrics.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 transition shadow-lg shadow-purple-100"
        >
          <Plus className="w-5 h-5" />
          Log Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-50 rounded-[2.5rem] p-8 border border-purple-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Total Fleet Burn
            </p>
          </div>
          <p className="text-4xl font-black text-purple-700">
            ₹{total.toLocaleString()}
          </p>
        </div>
        <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Fuel Consumption
            </p>
          </div>
          <p className="text-4xl font-black text-amber-700">
            {fuelLiters.toLocaleString()}{" "}
            <span className="text-lg">Liters</span>
          </p>
        </div>
        <div className="bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Cost/KM Avg
            </p>
          </div>
          <p className="text-4xl font-black text-blue-700">
            ₹8.40 <span className="text-lg">Avg</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">
            Financial Records
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Vehicle</th>
                  <th className="px-8 py-5">Trip Context</th>
                  <th className="px-8 py-5">Liters</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {expenses.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-6 font-black text-gray-900">
                      {e.vehicle}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 uppercase tracking-wider">
                        {e.trip}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-600">
                      {e.liters > 0 ? `${e.liters}L` : "—"}
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-400 font-bold uppercase">
                      {e.date}
                    </td>
                    <td className="px-8 py-6 text-right font-black text-gray-900 text-lg">
                      ₹{e.cost.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-20 text-center text-gray-400 font-bold"
                    >
                      No financial data found in Odoo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Per-Vehicle Operational Cost Breakdown */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-black text-gray-900">
              Per-Vehicle Operational Cost
            </h2>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Fuel + Maintenance
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Vehicle</th>
                <th className="px-8 py-5">Fuel Cost</th>
                <th className="px-8 py-5">Maintenance Cost</th>
                <th className="px-8 py-5 text-right">Total Operational Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {vehicleOpCost.map((v: any) => (
                <tr
                  key={v.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div>
                      <p className="font-black text-gray-900 text-sm">
                        {v.name}
                      </p>
                      <p className="text-xs text-gray-400">{v.license_plate}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-amber-600">
                    ₹{v.fuelCost.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 font-bold text-red-600">
                    ₹{v.maintCost.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-right font-black text-gray-900 text-lg">
                    ₹{v.totalOpCost.toLocaleString()}
                  </td>
                </tr>
              ))}
              {vehicleOpCost.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-16 text-center text-gray-400 font-bold"
                  >
                    No vehicle data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-inter">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gradient-to-br from-purple-50 via-transparent to-transparent">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  Log Expense
                </h2>
                <p className="text-sm text-gray-400 font-medium mt-1">
                  Record fuel intake or operational spend
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-100 p-2 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            <form onSubmit={handleCreateExpense} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Vehicle
                  </label>
                  <select
                    required
                    className="w-full bg-gray-50 border-2 border-transparent rounded-[1.25rem] p-5 focus:bg-white focus:border-purple-500 transition-all outline-none font-bold text-gray-900"
                    value={newExpense.vehicle_id}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        vehicle_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Context
                  </label>
                  <select
                    className="w-full bg-gray-50 border-2 border-transparent rounded-[1.25rem] p-5 focus:bg-white focus:border-purple-500 transition-all outline-none font-bold text-gray-900"
                    value={newExpense.trip_id}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, trip_id: e.target.value })
                    }
                  >
                    <option value="">General</option>
                    {trips
                      .filter(
                        (t) => t.vehicle_id === parseInt(newExpense.vehicle_id),
                      )
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Liters (Fuel Only)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-[1.25rem] p-5 focus:bg-white focus:border-purple-500 transition-all outline-none font-bold text-gray-900"
                    value={newExpense.liters}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, liters: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Total Cost (₹)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="0"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-[1.25rem] p-5 focus:bg-white focus:border-purple-500 transition-all outline-none font-bold text-gray-900"
                    value={newExpense.cost}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, cost: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                disabled={isProcessing}
                className="w-full bg-purple-600 text-white font-black py-6 rounded-[1.5rem] hover:bg-purple-700 transition-all shadow-2xl shadow-purple-200 mt-4 flex items-center justify-center gap-3 disabled:bg-purple-400"
              >
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
                Commit Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
