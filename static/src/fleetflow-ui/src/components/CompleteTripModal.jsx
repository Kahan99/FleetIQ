import { useState } from 'react';
import { X, Flag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CompleteTripModal({ isOpen, onClose, trip, onSubmit }) {
    const [endOdometer, setEndOdometer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !trip) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit(trip.id, parseInt(endOdometer));
            setEndOdometer('');
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to complete trip.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Complete Trip</h2>
                        <p className="text-sm text-gray-500">#{trip.name?.split('/').pop() || trip.id}</p>
                    </div>
                    <button onClick={onClose} disabled={isSubmitting} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <form id="complete-trip-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">End Odometer (km)</label>
                            <div className="relative">
                                <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={endOdometer}
                                    onChange={e => setEndOdometer(e.target.value)}
                                    placeholder="Enter final odometer reading"
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-600"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-800 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>Completing this trip will free up the vehicle and driver back to Available status.</p>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" form="complete-trip-form" disabled={isSubmitting}>
                        {isSubmitting ? 'Completing...' : 'Mark as Complete'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
