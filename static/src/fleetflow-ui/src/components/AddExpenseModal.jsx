import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AddExpenseModal({ isOpen, onClose, vehicles, onSubmit }) {
    const [formData, setFormData] = useState({
        vehicle_id: '',
        liters: '',
        cost: '',
        date: ''
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
                liters: formData.liters ? parseFloat(formData.liters) : null,
                cost: parseFloat(formData.cost),
                date: formData.date
            });
            setFormData({ vehicle_id: '', liters: '', cost: '', date: '' });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to log expense.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>
                        <p className="text-sm text-gray-500">Record fuel or operational costs.</p>
                    </div>
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="expense-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Vehicle</label>
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
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-600"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Fuel Liters (optional)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.liters}
                                    onChange={e => setFormData({ ...formData, liters: e.target.value })}
                                    placeholder="e.g. 50"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Cost (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.cost}
                                    onChange={e => setFormData({ ...formData, cost: e.target.value })}
                                    placeholder="e.g. 4500"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-600"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" form="expense-form" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Add Expense'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
