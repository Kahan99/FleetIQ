import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LogMaintenanceModal({ isOpen, onClose, vehicles, onSubmit }) {
    const [formData, setFormData] = useState({
        vehicle_id: '',
        issue: '',
        cost: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit({
                vehicle_id: parseInt(formData.vehicle_id),
                issue: formData.issue,
                cost: parseInt(formData.cost || 0)
            });
            setFormData({ vehicle_id: '', issue: '', cost: '' });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to log maintenance.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Log Maintenance</h2>
                        <p className="text-sm text-gray-500">Record vehicle service or repairs.</p>
                    </div>
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="maintenance-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Select Vehicle</label>
                            <select
                                required
                                value={formData.vehicle_id}
                                onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none bg-white">
                                <option value="">Select a vehicle...</option>
                                {vehicles?.map(v => (
                                    <option key={v.id} value={v.id}>{v.name} ({v.license_plate})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Issue / Service Description</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.issue}
                                onChange={e => setFormData({ ...formData, issue: e.target.value })}
                                placeholder="Describe the maintenance performed..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-600 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Estimated Cost (₹)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.cost}
                                onChange={e => setFormData({ ...formData, cost: e.target.value })}
                                placeholder="e.g. 5000"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-600"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 text-orange-800 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>Logging maintenance will automatically place the vehicle in 'In Shop' status making it unavailable for trips.</p>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" form="maintenance-form" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging...' : 'Log Maintenance'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
