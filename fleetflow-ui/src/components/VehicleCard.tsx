import { StatusPill } from './StatusPill';
import { Truck } from 'lucide-react';
import { Vehicle } from '@/types';

interface VehicleCardProps {
    vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                        <Truck className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">{vehicle.name}</h4>
                        <p className="text-sm text-gray-500 font-mono uppercase">{vehicle.license_plate}</p>
                    </div>
                </div>
                <StatusPill status={vehicle.status} />
            </div>
            <div className="mt-6 flex items-center justify-between text-sm">
                <div className="text-gray-500">
                    Capacity: <span className="font-semibold text-gray-900">{vehicle.max_capacity} Tons</span>
                </div>
                <button className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                    View Details
                </button>
            </div>
        </div>
    );
}
