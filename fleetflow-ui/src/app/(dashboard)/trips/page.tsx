"use client";

import { useState, useEffect } from "react";
import {
  Route,
  Plus,
  Search,
  Filter,
  Loader2,
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  getTrips,
  getVehicles,
  getDrivers,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} from "@/lib/api";
import { StatusPill } from "@/components/StatusPill";

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [allDrivers, setAllDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  const [newTrip, setNewTrip] = useState({
    vehicle_id: "",
    driver_id: "",
    origin: "",
    destination: "",
    cargo_weight: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        getTrips(),
        getVehicles(),
        getDrivers(),
      ]);
      setTrips(tripsData);
      setAllVehicles(vehiclesData);
      // Only show available vehicles (not maintenance, out_of_service, in_use)
      setVehicles(vehiclesData.filter((v: any) => v.status === "available"));
      setAllDrivers(driversData);
      // Only show on_duty drivers (not on_trip, off_duty, suspended, or expired)
      setDrivers(
        driversData.filter((d: any) => {
          const isExpired =
            d.license_expiry && new Date(d.license_expiry) < new Date();
          return (
            (d.status === "on_duty" || d.status === "active") && !isExpired
          );
        }),
      );
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Client-side cargo weight validation
  const selectedVehicle = allVehicles.find(
    (v) => v.id === parseInt(newTrip.vehicle_id),
  );
  const cargoWeight = parseFloat(newTrip.cargo_weight) || 0;
  const capacityExceeded =
    selectedVehicle && cargoWeight > selectedVehicle.max_capacity;

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Frontend validation: cargo weight > max capacity
    if (capacityExceeded) {
      setFormError(
        `Cargo weight (${cargoWeight}T) exceeds vehicle capacity (${selectedVehicle.max_capacity}T). Choose a larger vehicle or reduce cargo.`,
      );
      return;
    }

    try {
      setIsProcessing(true);
      await createTrip({
        ...newTrip,
        vehicle_id: parseInt(newTrip.vehicle_id),
        driver_id: parseInt(newTrip.driver_id),
        cargo_weight: parseFloat(newTrip.cargo_weight),
      });
      setIsModalOpen(false);
      setNewTrip({
        vehicle_id: "",
        driver_id: "",
        origin: "",
        destination: "",
        cargo_weight: "",
      });
      setFormError("");
      fetchData();
    } catch (error) {
      setFormError(String(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDispatch = async (tripId: number) => {
    try {
      await dispatchTrip(tripId);
      fetchData();
    } catch (error) {
      alert("Dispatch failed: " + error);
    }
  };

  const handleComplete = async (tripId: number) => {
    const odometer = prompt("Enter final odometer reading:");
    if (!odometer) return;
    try {
      await completeTrip({
        trip_id: tripId,
        end_odometer: parseFloat(odometer),
      });
      fetchData();
    } catch (error) {
      alert("Completion failed: " + error);
    }
  };

  const handleCancel = async (tripId: number) => {
    if (!confirm("Are you sure you want to cancel this trip?")) return;
    try {
      await cancelTrip(tripId);
      fetchData();
    } catch (error) {
      alert("Cancellation failed: " + error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Trip Management</h1>
          <p className="text-gray-500 mt-1">
            Dispatch vehicles and track delivery progress.
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setFormError("");
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" />
          Create New Trip
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Vehicle & Driver</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Weight</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50/30 transition">
                    <td className="px-6 py-5 font-black text-gray-900">
                      {trip.name}
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-gray-900">
                        {trip.vehicle}
                      </div>
                      <div className="text-xs text-gray-400">{trip.driver}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-sm font-bold text-gray-700">
                        <span>{trip.origin}</span>
                        <ArrowRightSmall />
                        <span>{trip.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-700">
                      {trip.cargo_weight} T
                    </td>
                    <td className="px-6 py-5">
                      <StatusPill status={trip.state} />
                    </td>
                    <td className="px-6 py-5 text-right space-x-2">
                      {trip.state === "draft" && (
                        <>
                          <button
                            onClick={() => handleDispatch(trip.id)}
                            className="text-white font-bold text-xs px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-100"
                          >
                            Dispatch
                          </button>
                          <button
                            onClick={() => handleCancel(trip.id)}
                            className="text-white font-bold text-xs px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {trip.state === "dispatched" && (
                        <>
                          <button
                            onClick={() => handleComplete(trip.id)}
                            className="text-white font-bold text-xs px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition shadow-md shadow-green-100"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleCancel(trip.id)}
                            className="text-white font-bold text-xs px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-inter">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-transparent">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Create Trip
                </h2>
                <p className="text-sm text-gray-400 font-medium">
                  Assign resources for new delivery
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-100 p-2 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateTrip} className="p-8 space-y-6">
              {formError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-bold">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Vehicle
                  </label>
                  <select
                    required
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                    value={newTrip.vehicle_id}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, vehicle_id: e.target.value })
                    }
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.license_plate}) — {v.max_capacity}T max
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Driver
                  </label>
                  <select
                    required
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                    value={newTrip.driver_id}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, driver_id: e.target.value })
                    }
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.phone || "No Phone"})
                      </option>
                    ))}
                  </select>
                  {drivers.length === 0 && (
                    <p className="text-xs text-amber-600 font-bold mt-1">
                      No available drivers (may be on trip, off duty, or have
                      expired license)
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Origin
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Mumbai"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                    value={newTrip.origin}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, origin: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Destination
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Pune"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                    value={newTrip.destination}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, destination: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Cargo Weight (Tons)
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  placeholder="8.5"
                  className={`w-full bg-gray-50 border-2 rounded-2xl p-4 focus:bg-white transition-all outline-none font-bold text-gray-900 ${capacityExceeded ? "border-red-400 bg-red-50" : "border-transparent focus:border-blue-500"}`}
                  value={newTrip.cargo_weight}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, cargo_weight: e.target.value })
                  }
                />
                {capacityExceeded && (
                  <p className="text-xs text-red-600 font-bold mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Exceeds max capacity of {selectedVehicle.max_capacity}T!
                  </p>
                )}
                {selectedVehicle && !capacityExceeded && cargoWeight > 0 && (
                  <p className="text-xs text-green-600 font-bold mt-1">
                    ✓ Within capacity ({cargoWeight}T /{" "}
                    {selectedVehicle.max_capacity}T)
                  </p>
                )}
              </div>

              <button
                disabled={isProcessing || !!capacityExceeded}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.25rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 mt-4 flex items-center justify-center gap-3 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                Initialize Trip
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowRightSmall() {
  return (
    <svg
      className="w-4 h-4 mx-2 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}
