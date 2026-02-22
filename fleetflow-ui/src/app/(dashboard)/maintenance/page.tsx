'use client';

import { useState, useEffect } from 'react';
import { Wrench, AlertCircle, CheckCircle2, Plus, X, Loader2 } from 'lucide-react';
import { getMaintenance, getVehicles, createMaintenance } from '@/lib/api';

export default function MaintenancePage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [newLog, setNewLog] = useState({
        vehicle_id: '',
        issue: '',
        cost: '',
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [logsData, vehiclesData] = await Promise.all([
                getMaintenance(),
                getVehicles(),
            ]);
            setLogs(logsData);
            setVehicles(vehiclesData);
        } catch (error) {
            console.error('Failed to fetch maintenance data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateLog = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsProcessing(true);
            await createMaintenance({
                ...newLog,
                vehicle_id: parseInt(newLog.vehicle_id),
                cost: parseFloat(newLog.cost),
            });
            setIsModalOpen(false);
            setNewLog({ vehicle_id: '', issue: '', cost: '' });
            fetchData();
        } catch (error) {
            alert('Failed to record maintenance: ' + error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Maintenance</h1>
                    <p className="text-gray-500 mt-1 font-medium">Track vehicle service records and fleet health.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-2xl font-black hover:bg-amber-700 transition shadow-lg shadow-amber-100"
                >
                    <Plus className="w-5 h-5" />
                    Record Maintenance
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Logs', count: logs.length, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Spend', count: `₹${(logs.reduce((s, l) => s + l.cost, 0) / 1000).toFixed(1)}k`, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Vehicles in Shop', count: vehicles.filter(v => v.status === 'maintenance').length, color: 'text-red-600', bg: 'bg-red-50' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-[2rem] border border-transparent p-6`}>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`text-4xl font-black ${s.color}`}>{s.count}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <Wrench className="w-6 h-6 text-amber-500" />
                        <h2 className="text-xl font-black text-gray-900">Service Logs</h2>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {logs.map(m => (
                            <div key={m.id} className="flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <AlertCircle className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">{m.vehicle}</p>
                                        <p className="text-sm text-gray-500 font-medium">{m.issue}</p>
                                        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">{m.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900 text-xl">₹{m.cost.toLocaleString()}</p>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Recorded Cost</p>
                                </div>
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <div className="p-20 text-center">
                                <p className="text-gray-400 font-bold">No maintenance records found in Odoo.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-inter">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-transparent">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Record Maintenance</h2>
                                <p className="text-sm text-gray-400 font-medium">Log vehicle repairs and service costs</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 p-2 rounded-xl text-gray-400 hover:text-gray-900 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateLog} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Vehicle</label>
                                <select
                                    required
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-amber-500 transition-all outline-none font-bold text-gray-900"
                                    value={newLog.vehicle_id}
                                    onChange={e => setNewLog({ ...newLog, vehicle_id: e.target.value })}
                                >
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.license_plate})</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Description of Issue</label>
                                <textarea
                                    required placeholder="e.g. Engine oil leak repair, tyre replacement..."
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-amber-500 transition-all outline-none font-bold text-gray-900 min-h-[100px]"
                                    value={newLog.issue}
                                    onChange={e => setNewLog({ ...newLog, issue: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Service Cost (₹)</label>
                                <input
                                    required type="number" placeholder="4500"
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-amber-500 transition-all outline-none font-bold text-gray-900"
                                    value={newLog.cost}
                                    onChange={e => setNewLog({ ...newLog, cost: e.target.value })}
                                />
                            </div>

                            <button
                                disabled={isProcessing}
                                className="w-full bg-amber-600 text-white font-black py-5 rounded-[1.25rem] hover:bg-amber-700 transition-all shadow-xl shadow-amber-200 mt-4 flex items-center justify-center gap-3 disabled:bg-amber-400"
                            >
                                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                Log Service
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
