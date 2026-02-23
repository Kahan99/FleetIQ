"use client";

import { useState, useEffect } from "react";
import { Truck, Search, Plus, Filter, MoreVertical, Loader2 } from "lucide-react";
import { getVehicles } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableRow, TableCell } from "@/components/ui/Table";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.license_plate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available": return "success";
      case "in_use": return "info";
      case "maintenance": return "warning";
      case "out_of_service": return "danger";
      default: return "neutral";
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32 gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading Fleet...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Fleet Vehicles
          </h1>
          <p className="text-gray-500 mt-1">Manage and track your entire vehicle inventory.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Add Vehicle
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none"
          />
        </div>
        <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
          More Filters
        </Button>
      </div>

      <Card>
        <Table headers={["Vehicle", "Type", "License Plate", "Region", "Status", ""]}>
          {filteredVehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="font-semibold text-gray-900">{vehicle.name}</span>
                </div>
              </TableCell>
              <TableCell className="capitalize">{vehicle.vehicle_type?.replace('_', ' ')}</TableCell>
              <TableCell className="font-mono text-xs font-medium uppercase">{vehicle.license_plate}</TableCell>
              <TableCell>{vehicle.region || "National"}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(vehicle.status)}>
                  {vehicle.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
        {filteredVehicles.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400">No vehicles found matching your search.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
