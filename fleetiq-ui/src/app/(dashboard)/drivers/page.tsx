"use client";

import { useState, useEffect } from "react";
import { Users, ShieldCheck, AlertCircle, Star, Search, Filter, Mail, Phone, ExternalLink, Loader2 } from "lucide-react";
import { getDrivers } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function DriverCard({ driver }: { driver: any }) {
  const completionRate = 85; // Mock data
  const safetyScore = driver.safety_score || 0;

  return (
    <Card className="hover:border-blue-200 transition-all group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-600 border border-blue-100 uppercase group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {driver.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{driver.name}</h3>
            <p className="text-xs text-gray-400 font-medium">Emp ID: #DRV-{driver.id}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="neutral" className="text-[10px] py-0">{driver.status?.replace('_', ' ') || 'Registered'}</Badge>
              {driver.license_expiry && new Date(driver.license_expiry) < new Date() && (
                <Badge variant="danger" className="text-[10px] py-0">License Expired</Badge>
              )}
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-gray-500 uppercase tracking-wider">Trip Completion</span>
            <span className="text-gray-900">{completionRate}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Safety Score</p>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className={`w-4 h-4 ${safetyScore >= 80 ? 'text-emerald-500' : 'text-orange-500'}`} />
              <span className="font-bold text-gray-900">{safetyScore}%</span>
            </div>
          </div>
          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rating</p>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-gray-900">4.8</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 pt-4 border-t border-gray-50">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs font-bold">
          <Phone className="w-3.5 h-3.5" /> Call
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs font-bold">
          <Mail className="w-3.5 h-3.5" /> Message
        </button>
      </div>
    </Card>
  );
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDrivers();
        setDrivers(data);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32 gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading Drivers...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Driver Performance
          </h1>
          <p className="text-gray-500 mt-1">Track safety scores, ratings and trip completions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<AlertCircle className="w-4 h-4" />}>Expiry Alerts</Button>
          <Button leftIcon={<Users className="w-4 h-4" />}>Add Driver</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          />
        </div>
        <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="py-32 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No drivers found matching your search.</p>
        </div>
      )}
    </div>
  );
}
