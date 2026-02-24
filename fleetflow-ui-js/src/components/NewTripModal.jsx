import { useState } from 'react';
import { X, MapPin, Truck, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NewTripModal({ isOpen, onClose, vehicles, drivers, onSubmit }) {
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        vehicle_id: '',
        driver_id: '',
        date: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Create New Trip</h2>
                        <p className="text-sm text-gray-500">Plan and dispatch a new delivery route.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="new-trip-form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Origin</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.origin}
                                        onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                        placeholder="e.g. Mumbai, MH"
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Destination</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.destination}
                                        onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                        placeholder="e.g. Pune, MH"
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Assign Vehicle</label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    required
                                    value={formData.vehicle_id}
                                    onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none bg-white">
                                    <option value="">Select a vehicle...</option>
                                    {vehicles?.filter(v => v.status === 'available').map(v => (
                                        <option key={v.id} value={v.id}>{v.name} ({v.license_plate})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Assign Driver</label>
                                <div className="relative">
                                    <select
                                        value={formData.driver_id}
                                        onChange={e => setFormData({ ...formData, driver_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none bg-white">
                                        <option value="">Select driver (optional)</option>
                                        {drivers?.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Schedule Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 text-orange-800 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>This will create a draft trip. You can dispatch it later from the trips page.</p>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="new-trip-form">Create Trip</Button>
                </div>
            </div>
        </div>
    );
}
