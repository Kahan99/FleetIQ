import { useState } from 'react';
import { X, Truck, Hash } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AddVehicleModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        license_plate: '',
        vehicle_type: 'truck',
        capacity: '',
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Add Vehicle</h2>
                        <p className="text-sm text-gray-500">Register a new vehicle in your fleet.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="add-vehicle-form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Vehicle Name/Model</label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Ford Transit F-150"
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">License Plate</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.license_plate}
                                    onChange={e => setFormData({ ...formData, license_plate: e.target.value.toUpperCase() })}
                                    placeholder="e.g. ABC 1234"
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all uppercase"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Vehicle Type</label>
                                <select
                                    required
                                    value={formData.vehicle_type}
                                    onChange={e => setFormData({ ...formData, vehicle_type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white">
                                    <option value="truck">Truck</option>
                                    <option value="van">Van</option>
                                    <option value="car">Car</option>
                                    <option value="motorcycle">Motorcycle</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Capacity (Tons)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    required
                                    value={formData.capacity}
                                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                    placeholder="e.g. 2.5"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="add-vehicle-form">Add Vehicle</Button>
                </div>
            </div>
        </div>
    );
}
