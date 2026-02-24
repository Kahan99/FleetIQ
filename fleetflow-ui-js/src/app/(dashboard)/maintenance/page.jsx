"use client";

import { useState } from "react";
import { Wrench, Calendar, AlertCircle, CheckCircle2, Search, Filter, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableRow, TableCell } from "@/components/ui/Table";

const MAINTENANCE_LOGS = [
  { id: 1, vehicle: "Eicher Pro 2049", plate: "TS08-EF-1234", service: "Engine Oil Change", date: "2024-10-20", cost: "₹4,500", status: "completed" },
  { id: 2, vehicle: "Tata Prima 5530", plate: "MH12-GH-5678", service: "Brake Pad Replacement", date: "2024-10-24", cost: "₹12,200", status: "in_progress" },
  { id: 3, vehicle: "BharatBenz 1923", plate: "KA01-JK-9012", service: "Tire Rotation", date: "2024-10-26", cost: "₹2,800", status: "scheduled" },
  { id: 4, vehicle: "Mahindra Blazo X", plate: "GJ05-LM-3456", service: "AC System Repair", date: "2024-10-22", cost: "₹8,900", status: "completed" },
  { id: 5, vehicle: "Ashok Leyland", plate: "TN07-NP-7890", service: "Major Overhaul", date: "2024-10-28", cost: "₹45,000", status: "pending_approval" }];


export default function MaintenancePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Maintenance logs
          </h1>
          <p className="text-gray-500 mt-1">Monitor fleet health and recurring service schedules.</p>
        </div>
        <Button variant="danger" leftIcon={<Wrench className="w-4 h-4" />}>
          Log Maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-orange-50 text-orange-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Issues</p>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Scheduled Service</p>
            <h3 className="text-2xl font-bold text-gray-900">08</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed (MTD)</p>
            <h3 className="text-2xl font-bold text-gray-900">45</h3>
          </div>
        </Card>
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
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Fitlers
          </Button>
        </div>

        <Table headers={["Vehicle", "Service Details", "Schedule Date", "Est. Cost", "Status", ""]}>
          {MAINTENANCE_LOGS.map((log) =>
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{log.vehicle}</span>
                  <span className="text-xs text-slate-400 font-mono">{log.plate}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium text-gray-700">{log.service}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{log.date}</span>
                </div>
              </TableCell>
              <TableCell className="font-bold text-gray-900">{log.cost}</TableCell>
              <TableCell>
                <Badge variant={
                  log.status === 'completed' ? 'success' :
                    log.status === 'in_progress' ? 'info' :
                      log.status === 'scheduled' ? 'neutral' : 'warning'
                }>
                  {log.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </TableCell>
            </TableRow>
          )}
        </Table>
      </Card>
    </div>);

}