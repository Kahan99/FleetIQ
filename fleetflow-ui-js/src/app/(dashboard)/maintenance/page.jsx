"use client";

import { useState, useEffect } from "react";
import { Wrench, Calendar, AlertCircle, CheckCircle2, Search, Filter, MoreHorizontal, Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import LogMaintenanceModal from "@/components/LogMaintenanceModal";
import { getMaintenance, getVehicles, createMaintenance } from "@/lib/api";

export default function MaintenancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [maintenance, setMaintenance] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mData, vData] = await Promise.all([getMaintenance(), getVehicles()]);
        setMaintenance(mData);
        setVehicles(vData);
      } catch (e) {
        console.error("Failed to fetch maintenance:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32 gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading Maintenance Logs...</p>
    </div>);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Maintenance logs
          </h1>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Log Maintenance
        </Button>
      </div>



      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by vehicle or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" />

          </div>
        </div>

        <Table headers={["Vehicle", "Service Details", "Schedule Date", "Est. Cost", "Status"]}>
          {maintenance.map((log) =>
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{log.vehicle}</span>
                  <span className="text-xs text-slate-400 font-mono">{log.plate || '—'}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium text-gray-700">{log.issue || log.service}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{log.date}</span>
                </div>
              </TableCell>
              <TableCell className="font-bold text-gray-900">{log.cost.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={
                  log.status === 'completed' ? 'success' :
                    log.status === 'in_progress' ? 'info' :
                      log.status === 'scheduled' ? 'neutral' : 'warning'
                }>
                  {(log.status || 'Scheduled').replace('_', ' ')}
                </Badge>
              </TableCell>
            </TableRow>
          )}
        </Table>
      </Card>

      <LogMaintenanceModal
        isOpen={showModal}
        vehicles={vehicles}
        onClose={() => setShowModal(false)}
        onSubmit={async (data) => {
          await createMaintenance({
            ...data,
            status: 'scheduled'
          });
          const mData = await getMaintenance();
          setMaintenance(mData);
          alert("Maintenance logged. Vehicle is now In Shop.");
        }}
      />
    </div>);

}