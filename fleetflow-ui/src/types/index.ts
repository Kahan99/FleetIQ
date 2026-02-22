import { LucideIcon } from 'lucide-react';

export interface Vehicle {
    id: number;
    name: string;
    license_plate: string;
    vehicle_type: 'car' | 'truck' | 'van' | 'bus' | 'other';
    status: 'available' | 'on_trip' | 'in_service' | 'maintenance' | 'inactive' | 'retired';
    max_capacity: number;
}

export interface Driver {
    id: number;
    name: string;
    license_number: string;
    status: 'on_duty' | 'off_duty' | 'leave';
    safety_score: number;
    license_expiry: string;
}

export interface Trip {
    id: number;
    name: string;
    origin: string;
    destination: string;
    cargo_weight: number;
    state: 'draft' | 'dispatched' | 'completed' | 'cancelled';
    vehicle_id: [number, string];
    driver_id: [number, string];
}

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
}
