"use client";

import { useState, useEffect } from "react";
import { DollarSign, Loader2, Search, Fuel, TrendingDown, PieChart, Plus } from "lucide-react";
import { getExpenses, getVehicles, createExpense } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import AddExpenseModal from "@/components/AddExpenseModal";

const TYPE_BADGE = {
  fuel: "bg-[#F59E0B]/10 text-[#F59E0B]",
  maintenance: "bg-[#2563EB]/10 text-[#2563EB]",
  insurance: "bg-purple-50 text-purple-600",
  toll: "bg-[#16A34A]/10 text-[#16A34A]",
  parking: "bg-gray-100 text-gray-500",
  other: "bg-gray-100 text-gray-500"
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eData, vData] = await Promise.all([getExpenses(), getVehicles()]);
        setExpenses(eData);
        setVehicles(vData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = expenses.filter((e) => {
    const matchSearch = ((e.vehicle || "") + (e.trip || "")).toLowerCase().includes(search.toLowerCase());
    const eType = e.liters ? "fuel" : "other";
    const matchType = filterType === "all" || eType === filterType;
    return matchSearch && matchType;
  });

  const totalCost = expenses.reduce((s, e) => s + (e.cost || 0), 0);
  const fuelCost = expenses.filter((e) => e.liters).reduce((s, e) => s + (e.cost || 0), 0);
  const maintenanceCost = expenses.filter((e) => e.expense_type === "maintenance").reduce((s, e) => s + (e.amount || 0), 0); // Kept for logic compat, although API doesn't spit out maintenance here (it's in maintenance).
  const otherCost = totalCost - fuelCost - maintenanceCost;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Expenses & Fuel</h1>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Add Expense
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Spend", value: `$${totalCost.toLocaleString()}`, icon: DollarSign, color: "#2563EB", bg: "bg-[#2563EB]/10" },
          { label: "Fuel Costs", value: `$${fuelCost.toLocaleString()}`, icon: Fuel, color: "#F59E0B", bg: "bg-[#F59E0B]/10" },
          { label: "Maintenance", value: `$${maintenanceCost.toLocaleString()}`, icon: TrendingDown, color: "#DC2626", bg: "bg-[#DC2626]/10" },
          { label: "Other", value: `$${otherCost.toLocaleString()}`, icon: PieChart, color: "#16A34A", bg: "bg-[#16A34A]/10" }].
          map((s) =>
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}><s.icon className="w-5 h-5" style={{ color: s.color }} /></div>
              </div>
              <p className="text-xs font-medium text-gray-400">{s.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{s.value}</p>
            </div>
          )}
      </div>

      {/* Search & Type Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by vehicle or description..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40" />
        </div>
        <div className="flex gap-2">
          {["all", "fuel", "maintenance", "insurance", "toll"].map((t) =>
            <button key={t} onClick={() => setFilterType(t)} className={`px-3.5 py-2 text-xs font-semibold rounded-lg capitalize transition-colors ${filterType === t ? "bg-[#2563EB] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              {t === "all" ? "All" : t}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ?
          <div className="flex items-center justify-center p-16"><Loader2 className="w-7 h-7 text-[#2563EB] animate-spin" /></div> :

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Vehicle</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ?
                  <tr><td colSpan={5} className="text-center py-12 text-sm text-gray-400">No expenses found</td></tr> :
                  filtered.map((e) =>
                    <tr key={e.id} className="table-row-hover">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#2563EB]/10 rounded-lg flex items-center justify-center"><DollarSign className="w-4 h-4 text-[#2563EB]" /></div>
                          <span className="text-sm font-semibold text-gray-900">{e.vehicle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${e.liters ? TYPE_BADGE.fuel : TYPE_BADGE.other}`}>
                          {e.liters ? "Fuel" : "Operational"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{e.liters ? `${e.liters} Liters` : "—"}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">${(e.cost || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{e.date || "—"}</td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        }
      </div>

      <AddExpenseModal
        isOpen={showModal}
        vehicles={vehicles}
        onClose={() => setShowModal(false)}
        onSubmit={async (data) => {
          await createExpense(data);
          const eData = await getExpenses();
          setExpenses(eData);
          alert("Expense logged successfully!");
        }}
      />
    </div>);

}