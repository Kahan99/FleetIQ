"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Truck, Route, Users, CreditCard, Wrench, TrendingUp,
  Loader2, Filter, Package, Search, Plus
} from "lucide-react";
import { getVehicles, getTrips } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableRow, TableCell } from "@/components/ui/Table";

function StatCard({ title, value, icon: Icon, trend, color = "blue" }: {
  title: string; value: string | number; icon: any; trend?: string; color?: string;
}) {
  return (
    <Card className="relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{ vehicles: any[]; trips: any[] }>({ vehicles: [], trips: [] });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [vData, tData] = await Promise.all([getVehicles(), getTrips()]);
        setData({ vehicles: vData, trips: tData });
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const activeFleet = data.vehicles.filter((v: any) => v.status === "in_use").length;
  const maintenanceAlerts = data.vehicles.filter((v: any) => v.status === "maintenance").length;
  const utilizationRate = data.vehicles.length > 0
    ? Math.round((activeFleet / data.vehicles.length) * 100)
    : 0;
  const pendingCargo = data.trips.filter((t: any) => t.state === "draft").length;

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32 gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Fleet Overview
          </h1>
          <p className="text-gray-500 mt-1">Manage and monitor your fleet operations in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            New Trip
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Fleet" value={activeFleet} icon={Truck} trend="+12% vs last month" />
        <StatCard title="Maintenance" value={maintenanceAlerts} icon={Wrench} trend="-2% vs last month" />
        <StatCard title="Utilization Rate" value={`${utilizationRate}%`} icon={TrendingUp} trend="+5% vs last month" />
        <StatCard title="Pending Cargo" value={pendingCargo} icon={Package} trend="+8% vs last month" />
      </div>

      {/* Recent Trips Table */}
      <Card title="Recent Fleet Activity" subtitle="Real-time status of your latest trips and deliveries.">
        <Table headers={["Trip ID", "Vehicle", "Route", "Schedule", "Status", "Action"]}>
          {data.trips.slice(0, 6).map((trip: any) => (
            <TableRow key={trip.id}>
              <TableCell className="font-semibold text-gray-900">#{trip.name.split('/').pop()}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{trip.vehicle_id?.[1] || "Unassigned"}</span>
                  <span className="text-xs text-gray-400">Standard Truck</span>
                </div>
              </TableCell>
              <TableCell>{trip.origin} → {trip.destination}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-gray-900 font-medium">Oct 24, 2024</span>
                  <span className="text-xs text-gray-400">09:00 AM</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={
                  trip.state === "completed" ? "success" :
                    trip.state === "dispatched" ? "info" :
                      trip.state === "cancelled" ? "danger" : "neutral"
                }>
                  {trip.state.charAt(0) + trip.state.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <button className="text-blue-600 font-semibold hover:underline text-xs">View Details</button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}

