"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MapPin, Loader2 } from "lucide-react";
import { getTrips, createTrip, dispatchTrip, completeTrip } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import NewTripModal from "@/components/NewTripModal";
import CompleteTripModal from "@/components/CompleteTripModal";
import { getVehicles, getDrivers } from "@/lib/api";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [completingTrip, setCompletingTrip] = useState(null);

  const handleDispatch = async (tripId) => {
    try {
      await dispatchTrip(tripId);
      const newTrips = await getTrips();
      setTrips(newTrips);
    } catch (e) {
      alert(e.message || "Failed to dispatch");
    }
  };

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
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowNewTripModal(true)}>
          Create New Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <Card className="!p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Active Shipments</h3>
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
                    {trip.state === 'draft' && (
                      <Button size="sm" onClick={() => handleDispatch(trip.id)}>Dispatch</Button>
                    )}
                    {trip.state === 'dispatched' && (
                      <Button size="sm" variant="secondary" onClick={() => setCompletingTrip(trip)}>Complete</Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </Card>
        </div>

        <NewTripModal
          isOpen={showNewTripModal}
          onClose={() => setShowNewTripModal(false)}
          vehicles={vehicles}
          drivers={drivers}
          onSubmit={async (tripData) => {
            try {
              const result = await createTrip({
                origin: tripData.origin,
                destination: tripData.destination,
                vehicle_id: parseInt(tripData.vehicle_id),
                driver_id: parseInt(tripData.driver_id),
                date: tripData.date,
                cargo_weight: parseInt(tripData.cargo_weight)
              });
              // Result comes back with simple vehicle name instead of tuple. We need to format it or just re-fetch.
              // Let's just re-fetch to ensure all nested joins are consistent.
              const newTrips = await getTrips();
              setTrips(newTrips);
              alert("Trip created successfully!");
              setShowNewTripModal(false);
            } catch (error) {
              throw error; // Bubble up to Modal
            }
          }}
        />

        <CompleteTripModal
          isOpen={!!completingTrip}
          trip={completingTrip}
          onClose={() => setCompletingTrip(null)}
          onSubmit={async (tripId, endOdometer) => {
            await completeTrip({ trip_id: tripId, end_odometer: endOdometer });
            const newTrips = await getTrips();
            setTrips(newTrips);
            // also refresh vehicles to get new odometer
            setVehicles(await getVehicles());
            setDrivers(await getDrivers());
            alert("Trip completed successfully!");
          }}
        />
      </div>
    </div >
  );

}