"use client";

import { useState, useEffect } from "react";
import { Truck, Plus, X, Loader2, Ban, RotateCcw } from "lucide-react";
import { getVehicles, createVehicle, toggleVehicleOOS } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
  on_trip: "bg-blue-100 text-blue-700",
  available: "bg-green-100 text-green-700",
  in_service: "bg-gray-100 text-gray-600",
  in_shop: "bg-red-100 text-red-700",
  in_use: "bg-blue-100 text-blue-700",
  inactive: "bg-gray-100 text-gray-400",
  maintenance: "bg-yellow-100 text-yellow-700",
  out_of_service: "bg-red-100 text-red-600",
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    license_plate: "",
    vehicle_type: "truck",
    max_capacity: "",
    odometer: "",
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVehicle({
        ...newVehicle,
        max_capacity: parseFloat(newVehicle.max_capacity) || 0,
        odometer: parseFloat(newVehicle.odometer) || 0,
      });
      setIsModalOpen(false);
      setNewVehicle({
        name: "",
        license_plate: "",
        vehicle_type: "truck",
        max_capacity: "",
        odometer: "",
      });
      fetchVehicles();
    } catch (error) {
      alert("Failed to add vehicle: " + error);
    }
  };

  const handleToggleOOS = async (vehicleId: number) => {
    try {
      await toggleVehicleOOS(vehicleId);
      fetchVehicles();
    } catch (error) {
      alert("Failed to toggle status: " + error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Vehicle Registry
          </h1>
          <p className="text-gray-500 mt-1">
            Fleet status, capacity, odometer, and financial metrics.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          <Truck className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className={`bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-shadow ${v.status === "out_of_service" ? "border-red-200 opacity-70" : "border-gray-100"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_STYLES[v.status] || "bg-gray-100 text-gray-600"}`}
                >
                  {(v.status || "").replace(/_/g, " ")}
                </span>
              </div>
              <h3 className="font-black text-gray-900 text-lg">{v.name}</h3>
              <p className="text-sm text-gray-400">{v.license_plate}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Type</p>
                  <p className="font-bold text-gray-700 capitalize text-sm">
                    {v.vehicle_type}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Capacity</p>
                  <p className="font-bold text-gray-700 text-sm">
                    {v.max_capacity}T
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Odometer</p>
                  <p className="font-bold text-gray-700 text-sm">
                    {(v.odometer || 0).toLocaleString()} km
                  </p>
                </div>
              </div>
              {/* Out of Service toggle */}
              <div className="mt-4 pt-3 border-t border-gray-50">
                <button
                  onClick={() => handleToggleOOS(v.id)}
                  className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition w-full justify-center ${
                    v.status === "out_of_service"
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  {v.status === "out_of_service" ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" /> Restore to Service
                    </>
                  ) : (
                    <>
                      <Ban className="w-3.5 h-3.5" /> Mark Out of Service
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">New Vehicle</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddVehicle} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Vehicle Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition outline-none"
                  placeholder="e.g. Truck Alpha"
                  value={newVehicle.name}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  License Plate
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition outline-none"
                  placeholder="GJ-01-XX-0000"
                  value={newVehicle.license_plate}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      license_plate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    Type
                  </label>
                  <select
                    className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition outline-none"
                    value={newVehicle.vehicle_type}
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        vehicle_type: e.target.value,
                      })
                    }
                  >
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                    <option value="bike">Bike</option>
                    <option value="car">Car</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    Capacity (T)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition outline-none"
                    placeholder="10.0"
                    value={newVehicle.max_capacity}
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        max_capacity: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    Odometer
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition outline-none"
                    placeholder="0"
                    value={newVehicle.odometer}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, odometer: e.target.value })
                    }
                  />
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 mt-4 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Create Vehicle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
