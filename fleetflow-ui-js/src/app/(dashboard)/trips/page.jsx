"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MapPin, Loader2 } from "lucide-react";
import { getTrips } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import NewTripModal from "@/components/NewTripModal";
import { getVehicles, getDrivers } from "@/lib/api";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTripModal, setShowNewTripModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tData, vData, dData] = await Promise.all([getTrips(), getVehicles(), getDrivers()]);
        setTrips(tData);
        setVehicles(vData);
        setDrivers(dData);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32 gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading Trips...</p>
    </div>);


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Trips & Logistics
          </h1>
          <p className="text-gray-500 mt-1">Plan, dispatch, and track your fleet deliveries.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowNewTripModal(true)}>
          Create New Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="!p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Active Shipments</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" leftIcon={<Filter className="w-3 h-3" />}>Filter</Button>
                <Button variant="ghost" size="sm" leftIcon={<Search className="w-3 h-3" />}>Search</Button>
              </div>
            </div>
            <Table headers={["ID", "Route", "Vehicle/Driver", "Status", "Actions"]}>
              {trips.map((trip) =>
                <TableRow key={trip.id}>
                  <TableCell className="font-bold">#{trip.name.split('/').pop()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{trip.origin}</span>
                      <span className="text-xs text-gray-400">to {trip.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-600">{trip.vehicle_id?.[1] || "No Vehicle"}</span>
                      <span className="text-[10px] text-gray-400">{trip.driver_id?.[1] || "No Driver"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={trip.state === 'dispatched' ? 'info' : trip.state === 'completed' ? 'success' : 'neutral'}>
                      {trip.state}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-[10px] h-7">Dispatch</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Quick Trip Creation" className="bg-blue-600 text-white">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-100 uppercase tracking-wider">Route Details</label>
                <div className="flex gap-2">
                  <div className="bg-white/10 rounded-xl p-3 flex-1">
                    <MapPin className="w-4 h-4 text-blue-200 mb-1" />
                    <p className="text-xs font-medium text-white/60">Origin</p>
                    <p className="text-sm font-bold">Mumbai MH</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 flex-1 text-right">
                    <MapPin className="w-4 h-4 text-blue-200 mb-1 ml-auto" />
                    <p className="text-xs font-medium text-white/60">Destination</p>
                    <p className="text-sm font-bold">Pune MH</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cargo Weight</span>
                  <span className="font-bold text-lg">14.5 T</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Distance</span>
                  <span className="font-bold text-lg">150 km</span>
                </div>
              </div>
              <Button variant="secondary" className="w-full h-12 text-blue-600 font-bold text-lg" onClick={() => setShowNewTripModal(true)}>
                Dispatch Now
              </Button>
            </div>
          </Card>

          <Card title="Trip Lifecycle">
            <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-[12px] h-[12px] rounded-full bg-blue-600 border-2 border-white" />
                <p className="text-sm font-bold text-gray-900">Draft Created</p>
                <p className="text-xs text-gray-400">System generated via CRM</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-[12px] h-[12px] rounded-full bg-blue-400 border-2 border-white" />
                <p className="text-sm font-bold text-gray-900">Vehicle Assigned</p>
                <p className="text-xs text-gray-400">TS12-AB-5678 assigned</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-[12px] h-[12px] rounded-full bg-gray-200 border-2 border-white" />
                <p className="text-sm font-bold text-gray-400">Departure</p>
                <p className="text-xs text-gray-400">Awaiting dispatch button</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <NewTripModal
        isOpen={showNewTripModal}
        onClose={() => setShowNewTripModal(false)}
        vehicles={vehicles}
        drivers={drivers}
        onSubmit={(tripData) => {
          const newTrip = {
            id: Math.random(),
            name: `TRIP/${Math.floor(Math.random() * 1000)}`,
            vehicle_id: [tripData.vehicle_id, vehicles.find(v => v.id == tripData.vehicle_id)?.name || "Unknown"],
            driver_id: [tripData.driver_id, drivers.find(d => d.id == tripData.driver_id)?.name || "Unknown"],
            origin: tripData.origin,
            destination: tripData.destination,
            state: 'draft'
          };
          setTrips(prev => [newTrip, ...prev]);
          alert("Trip created successfully!");
        }}
      />
    </div>);

}