export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8069";

// ── Demo / Mock Data ──────────────────────────────────────────────────
// Used as fallback when Odoo backend is unreachable so the UI still works.

let _nextId = 100;
const nextId = () => ++_nextId;

const MOCK_VEHICLES = [
  {
    id: 1,
    name: "Tata Ace Gold",
    license_plate: "MH-12-AB-1234",
    vehicle_type: "truck",
    max_capacity: 750,
    odometer: 45230,
    status: "available",
    region: "West",
    acquisition_cost: 450000,
    total_revenue: 245000,
    total_operational_cost: 98000,
    roi: 150,
  },
  {
    id: 2,
    name: "Ashok Leyland Dost+",
    license_plate: "MH-14-CD-5678",
    vehicle_type: "truck",
    max_capacity: 1500,
    odometer: 78400,
    status: "in_use",
    region: "West",
    acquisition_cost: 850000,
    total_revenue: 520000,
    total_operational_cost: 210000,
    roi: 148,
  },
  {
    id: 3,
    name: "Mahindra Bolero Pickup",
    license_plate: "KA-01-EF-9012",
    vehicle_type: "truck",
    max_capacity: 1200,
    odometer: 32100,
    status: "available",
    region: "South",
    acquisition_cost: 720000,
    total_revenue: 310000,
    total_operational_cost: 145000,
    roi: 114,
  },
  {
    id: 4,
    name: "Eicher Pro 2049",
    license_plate: "TN-07-GH-3456",
    vehicle_type: "truck",
    max_capacity: 4900,
    odometer: 120500,
    status: "maintenance",
    region: "South",
    acquisition_cost: 1800000,
    total_revenue: 890000,
    total_operational_cost: 420000,
    roi: 112,
  },
  {
    id: 5,
    name: "BharatBenz 1415R",
    license_plate: "DL-05-IJ-7890",
    vehicle_type: "truck",
    max_capacity: 9000,
    odometer: 95200,
    status: "in_use",
    region: "North",
    acquisition_cost: 2500000,
    total_revenue: 1150000,
    total_operational_cost: 530000,
    roi: 117,
  },
  {
    id: 6,
    name: "Maruti Suzuki Eeco Cargo",
    license_plate: "GJ-06-KL-2345",
    vehicle_type: "van",
    max_capacity: 460,
    odometer: 18700,
    status: "available",
    region: "West",
    acquisition_cost: 380000,
    total_revenue: 125000,
    total_operational_cost: 62000,
    roi: 102,
  },
];

const MOCK_DRIVERS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    license_number: "DL-0420110012345",
    status: "on_duty",
    safety_score: 92,
    license_expiry: "2027-03-15",
    phone: "9876543210",
    trips_completed: 47,
    trips_total: 50,
  },
  {
    id: 2,
    name: "Amit Sharma",
    license_number: "MH-0320100067890",
    status: "on_trip",
    safety_score: 88,
    license_expiry: "2026-11-20",
    phone: "9876543211",
    trips_completed: 32,
    trips_total: 36,
  },
  {
    id: 3,
    name: "Priya Patel",
    license_number: "KA-0120120034567",
    status: "off_duty",
    safety_score: 95,
    license_expiry: "2028-01-10",
    phone: "9876543212",
    trips_completed: 28,
    trips_total: 29,
  },
  {
    id: 4,
    name: "Suresh Reddy",
    license_number: "TN-0720090089012",
    status: "on_duty",
    safety_score: 78,
    license_expiry: "2024-06-30",
    phone: "9876543213",
    trips_completed: 55,
    trips_total: 62,
  },
  {
    id: 5,
    name: "Deepak Singh",
    license_number: "DL-0520110045678",
    status: "on_trip",
    safety_score: 85,
    license_expiry: "2027-09-05",
    phone: "9876543214",
    trips_completed: 41,
    trips_total: 44,
  },
];

const MOCK_TRIPS = [
  {
    id: 1,
    name: "TRIP/2026/001",
    vehicle: "Tata Ace Gold",
    vehicle_id: 1,
    driver: "Rajesh Kumar",
    driver_id: 1,
    origin: "Mumbai",
    destination: "Pune",
    cargo_weight: 600,
    state: "completed",
  },
  {
    id: 2,
    name: "TRIP/2026/002",
    vehicle: "Ashok Leyland Dost+",
    vehicle_id: 2,
    driver: "Amit Sharma",
    driver_id: 2,
    origin: "Delhi",
    destination: "Jaipur",
    cargo_weight: 1200,
    state: "dispatched",
  },
  {
    id: 3,
    name: "TRIP/2026/003",
    vehicle: "BharatBenz 1415R",
    vehicle_id: 5,
    driver: "Deepak Singh",
    driver_id: 5,
    origin: "Chennai",
    destination: "Bangalore",
    cargo_weight: 7500,
    state: "dispatched",
  },
  {
    id: 4,
    name: "TRIP/2026/004",
    vehicle: "Mahindra Bolero Pickup",
    vehicle_id: 3,
    driver: "Suresh Reddy",
    driver_id: 4,
    origin: "Ahmedabad",
    destination: "Surat",
    cargo_weight: 900,
    state: "draft",
  },
  {
    id: 5,
    name: "TRIP/2026/005",
    vehicle: "Maruti Suzuki Eeco Cargo",
    vehicle_id: 6,
    driver: "Rajesh Kumar",
    driver_id: 1,
    origin: "Hyderabad",
    destination: "Vijayawada",
    cargo_weight: 400,
    state: "completed",
  },
  {
    id: 6,
    name: "TRIP/2026/006",
    vehicle: "Tata Ace Gold",
    vehicle_id: 1,
    driver: "Priya Patel",
    driver_id: 3,
    origin: "Kolkata",
    destination: "Patna",
    cargo_weight: 500,
    state: "draft",
  },
];

const MOCK_MAINTENANCE = [
  {
    id: 1,
    vehicle: "Eicher Pro 2049",
    vehicle_id: 4,
    issue: "Engine overheating — thermostat replacement",
    date: "2026-02-18",
    cost: 12500,
  },
  {
    id: 2,
    vehicle: "Ashok Leyland Dost+",
    vehicle_id: 2,
    issue: "Brake pad replacement (front)",
    date: "2026-02-10",
    cost: 4800,
  },
  {
    id: 3,
    vehicle: "Tata Ace Gold",
    vehicle_id: 1,
    issue: "Oil change & filter service",
    date: "2026-01-28",
    cost: 2200,
  },
  {
    id: 4,
    vehicle: "BharatBenz 1415R",
    vehicle_id: 5,
    issue: "Tyre rotation + wheel alignment",
    date: "2026-01-15",
    cost: 6500,
  },
];

const MOCK_EXPENSES = [
  {
    id: 1,
    vehicle: "Tata Ace Gold",
    vehicle_id: 1,
    trip: "TRIP/2026/001",
    trip_id: 1,
    liters: 45,
    date: "2026-02-20",
    cost: 4725,
  },
  {
    id: 2,
    vehicle: "Ashok Leyland Dost+",
    vehicle_id: 2,
    trip: "TRIP/2026/002",
    trip_id: 2,
    liters: 80,
    date: "2026-02-19",
    cost: 8400,
  },
  {
    id: 3,
    vehicle: "BharatBenz 1415R",
    vehicle_id: 5,
    trip: "TRIP/2026/003",
    trip_id: 3,
    liters: 120,
    date: "2026-02-18",
    cost: 12600,
  },
  {
    id: 4,
    vehicle: "Mahindra Bolero Pickup",
    vehicle_id: 3,
    trip: null,
    trip_id: null,
    liters: 55,
    date: "2026-02-15",
    cost: 5775,
  },
  {
    id: 5,
    vehicle: "Maruti Suzuki Eeco Cargo",
    vehicle_id: 6,
    trip: "TRIP/2026/005",
    trip_id: 5,
    liters: 30,
    date: "2026-02-12",
    cost: 3150,
  },
];

// Mutable copies so create operations persist during session
let mockVehicles = [...MOCK_VEHICLES];
let mockDrivers = [...MOCK_DRIVERS];
let mockTrips = [...MOCK_TRIPS];
let mockMaintenance = [...MOCK_MAINTENANCE];
let mockExpenses = [...MOCK_EXPENSES];

// ── Helper: Generic Fetch (with demo fallback) ───────────────────────
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  } catch {
    // Odoo backend unreachable — return demo data
    return demoBranch(endpoint);
  }
}

// ── Helper: JSON-RPC (with demo fallback) ─────────────────────────────
async function apiPostJson(endpoint: string, params: any = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonrpcPayload(params),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message || "JSON-RPC Error");
    return data.result;
  } catch {
    return demoMutate(endpoint, params);
  }
}

function jsonrpcPayload(params: any) {
  return JSON.stringify({
    jsonrpc: "2.0",
    method: "call",
    params: params,
    id: Math.floor(Math.random() * 1000000),
  });
}

// ── Demo routing ──────────────────────────────────────────────────────
function demoBranch(endpoint: string) {
  const path = endpoint.split("?")[0];
  switch (path) {
    case "/FleetIQ/vehicles":
      return { data: mockVehicles };
    case "/FleetIQ/drivers":
      return { data: mockDrivers };
    case "/FleetIQ/trips":
      return { data: mockTrips };
    case "/FleetIQ/maintenance":
      return { data: mockMaintenance };
    case "/FleetIQ/expenses":
      return { data: mockExpenses };
    default:
      return { data: [] };
  }
}

function demoMutate(endpoint: string, params: any) {
  switch (endpoint) {
    case "/FleetIQ/vehicle/create": {
      const v = {
        id: nextId(),
        status: "available",
        odometer: 0,
        region: "West",
        acquisition_cost: 0,
        total_revenue: 0,
        total_operational_cost: 0,
        roi: 0,
        ...params,
      };
      mockVehicles = [...mockVehicles, v];
      return v;
    }
    case "/FleetIQ/vehicle/toggle_oos": {
      mockVehicles = mockVehicles.map((v) =>
        v.id === params.vehicle_id
          ? {
              ...v,
              status:
                v.status === "out_of_service" ? "available" : "out_of_service",
            }
          : v,
      );
      return { success: true };
    }
    case "/FleetIQ/driver/create": {
      const d = {
        id: nextId(),
        status: "on_duty",
        safety_score: 80,
        trips_completed: 0,
        trips_total: 0,
        ...params,
      };
      mockDrivers = [...mockDrivers, d];
      return d;
    }
    case "/FleetIQ/driver/toggle_status": {
      mockDrivers = mockDrivers.map((d) =>
        d.id === params.driver_id ? { ...d, status: params.status } : d,
      );
      return { success: true };
    }
    case "/FleetIQ/trip/create": {
      // Cargo weight validation
      const vehicle = mockVehicles.find((v) => v.id === params.vehicle_id);
      const driver = mockDrivers.find((d) => d.id === params.driver_id);
      if (vehicle && params.cargo_weight > vehicle.max_capacity) {
        throw new Error(
          `Cargo weight (${params.cargo_weight}T) exceeds vehicle capacity (${vehicle.max_capacity}T)`,
        );
      }
      // Block expired license
      if (
        driver &&
        driver.license_expiry &&
        new Date(driver.license_expiry) < new Date()
      ) {
        throw new Error(
          `Driver ${driver.name}'s license has expired. Cannot assign to trip.`,
        );
      }
      const t = {
        id: nextId(),
        name: `TRIP/2026/${String(mockTrips.length + 1).padStart(3, "0")}`,
        vehicle: vehicle?.name ?? "",
        driver: driver?.name ?? "",
        state: "draft",
        ...params,
      };
      mockTrips = [...mockTrips, t];
      return t;
    }
    case "/FleetIQ/trip/dispatch": {
      const trip = mockTrips.find((t) => t.id === params.trip_id);
      // Update trip state
      mockTrips = mockTrips.map((t) =>
        t.id === params.trip_id ? { ...t, state: "dispatched" } : t,
      );
      // Auto-update: Vehicle → in_use, Driver → on_trip
      if (trip) {
        mockVehicles = mockVehicles.map((v) =>
          v.id === trip.vehicle_id ? { ...v, status: "in_use" } : v,
        );
        mockDrivers = mockDrivers.map((d) =>
          d.id === trip.driver_id ? { ...d, status: "on_trip" } : d,
        );
      }
      return { success: true };
    }
    case "/FleetIQ/trip/complete": {
      const trip = mockTrips.find((t) => t.id === params.trip_id);
      mockTrips = mockTrips.map((t) =>
        t.id === params.trip_id
          ? { ...t, state: "completed", end_odometer: params.end_odometer }
          : t,
      );
      // Auto-update: Vehicle → available, Driver → on_duty
      if (trip) {
        mockVehicles = mockVehicles.map((v) =>
          v.id === trip.vehicle_id
            ? {
                ...v,
                status: "available",
                odometer: params.end_odometer || v.odometer,
              }
            : v,
        );
        mockDrivers = mockDrivers.map((d) =>
          d.id === trip.driver_id ? { ...d, status: "on_duty" } : d,
        );
      }
      return { success: true };
    }
    case "/FleetIQ/trip/cancel": {
      const trip = mockTrips.find((t) => t.id === params.trip_id);
      mockTrips = mockTrips.map((t) =>
        t.id === params.trip_id ? { ...t, state: "cancelled" } : t,
      );
      // If it was dispatched, free up vehicle & driver
      if (trip && trip.state === "dispatched") {
        mockVehicles = mockVehicles.map((v) =>
          v.id === trip.vehicle_id ? { ...v, status: "available" } : v,
        );
        mockDrivers = mockDrivers.map((d) =>
          d.id === trip.driver_id ? { ...d, status: "on_duty" } : d,
        );
      }
      return { success: true };
    }
    case "/FleetIQ/maintenance/create": {
      const vehicle = mockVehicles.find((v) => v.id === params.vehicle_id);
      const m = {
        id: nextId(),
        vehicle: vehicle?.name ?? "",
        date: new Date().toISOString().slice(0, 10),
        ...params,
      };
      mockMaintenance = [...mockMaintenance, m];
      // Auto-logic: Vehicle → maintenance (In Shop)
      mockVehicles = mockVehicles.map((v) =>
        v.id === params.vehicle_id ? { ...v, status: "maintenance" } : v,
      );
      return m;
    }
    case "/FleetIQ/expense/create": {
      const vehicle = mockVehicles.find((v) => v.id === params.vehicle_id);
      const trip = mockTrips.find((t) => t.id === params.trip_id);
      const e = {
        id: nextId(),
        vehicle: vehicle?.name ?? "",
        trip: trip?.name ?? null,
        date: new Date().toISOString().slice(0, 10),
        ...params,
      };
      mockExpenses = [...mockExpenses, e];
      return e;
    }
    default:
      return { success: true };
  }
}

// ── Vehicles ────────────────────────────────────────────────────────
export async function getVehicles() {
  const res = await apiFetch("/FleetIQ/vehicles");
  return res.data;
}

export async function createVehicle(data: any) {
  return apiPostJson("/FleetIQ/vehicle/create", data);
}

// ── Drivers ─────────────────────────────────────────────────────────
export async function getDrivers() {
  const res = await apiFetch("/FleetIQ/drivers");
  return res.data;
}

export async function createDriver(data: any) {
  return apiPostJson("/FleetIQ/driver/create", data);
}

// ── Trips ───────────────────────────────────────────────────────────
export async function getTrips(state?: string) {
  const endpoint = state
    ? `/FleetIQ/trips?state=${state}`
    : "/FleetIQ/trips";
  const res = await apiFetch(endpoint);
  return res.data;
}

export async function createTrip(data: any) {
  return apiPostJson("/FleetIQ/trip/create", data);
}

export async function dispatchTrip(tripId: number) {
  return apiPostJson("/FleetIQ/trip/dispatch", { trip_id: tripId });
}

export async function completeTrip(params: {
  trip_id: number;
  end_odometer: number;
  revenue?: number;
}) {
  return apiPostJson("/FleetIQ/trip/complete", params);
}
// ── Maintenance ────────────────────────────────────────────────────
export async function getMaintenance() {
  const res = await apiFetch("/FleetIQ/maintenance");
  return res.data;
}

export async function createMaintenance(data: {
  vehicle_id: number;
  issue: string;
  cost: number;
  date?: string;
}) {
  return apiPostJson("/FleetIQ/maintenance/create", data);
}

// ── Expenses ───────────────────────────────────────────────────────
export async function getExpenses() {
  const res = await apiFetch("/FleetIQ/expenses");
  return res.data;
}

export async function createExpense(data: {
  vehicle_id: number;
  liters: number;
  cost: number;
  trip_id?: number;
  date?: string;
}) {
  return apiPostJson("/FleetIQ/expense/create", data);
}

// ── Vehicle Toggle Out-of-Service ──────────────────────────────────
export async function toggleVehicleOOS(vehicleId: number) {
  return apiPostJson("/FleetIQ/vehicle/toggle_oos", {
    vehicle_id: vehicleId,
  });
}

// ── Driver Status Toggle ───────────────────────────────────────────
export async function toggleDriverStatus(driverId: number, status: string) {
  return apiPostJson("/FleetIQ/driver/toggle_status", {
    driver_id: driverId,
    status,
  });
}

// ── Cancel Trip ────────────────────────────────────────────────────
export async function cancelTrip(tripId: number) {
  return apiPostJson("/FleetIQ/trip/cancel", { trip_id: tripId });
}

// ── Analytics helpers (computed from mock data) ────────────────────
export async function getAnalytics() {
  const [vehicles, trips, expenses, maintenance] = await Promise.all([
    getVehicles(),
    getTrips(),
    getExpenses(),
    getMaintenance(),
  ]);

  // Fuel efficiency per vehicle
  const vehicleAnalytics = vehicles.map((v: any) => {
    const vExpenses = expenses.filter((e: any) => e.vehicle_id === v.id);
    const vMaintenance = maintenance.filter((m: any) => m.vehicle_id === v.id);
    const vTrips = trips.filter(
      (t: any) => t.vehicle_id === v.id && t.state === "completed",
    );

    const totalFuelCost = vExpenses.reduce(
      (s: number, e: any) => s + (e.cost || 0),
      0,
    );
    const totalFuelLiters = vExpenses.reduce(
      (s: number, e: any) => s + (e.liters || 0),
      0,
    );
    const totalMaintenanceCost = vMaintenance.reduce(
      (s: number, m: any) => s + (m.cost || 0),
      0,
    );
    const totalOperationalCost = totalFuelCost + totalMaintenanceCost;
    const revenue = v.total_revenue || 0;
    const acquisitionCost = v.acquisition_cost || 1;
    const roi =
      acquisitionCost > 0
        ? (((revenue - totalOperationalCost) / acquisitionCost) * 100).toFixed(
            1,
          )
        : 0;
    const fuelEfficiency =
      totalFuelLiters > 0 ? (v.odometer / totalFuelLiters).toFixed(1) : "N/A";

    return {
      id: v.id,
      name: v.name,
      license_plate: v.license_plate,
      vehicle_type: v.vehicle_type,
      odometer: v.odometer,
      revenue,
      totalFuelCost,
      totalFuelLiters,
      totalMaintenanceCost,
      totalOperationalCost,
      acquisitionCost,
      roi,
      fuelEfficiency,
      tripsCompleted: vTrips.length,
    };
  });

  const totals = {
    totalRevenue: vehicleAnalytics.reduce(
      (s: number, v: any) => s + v.revenue,
      0,
    ),
    totalFuelCost: vehicleAnalytics.reduce(
      (s: number, v: any) => s + v.totalFuelCost,
      0,
    ),
    totalMaintenanceCost: vehicleAnalytics.reduce(
      (s: number, v: any) => s + v.totalMaintenanceCost,
      0,
    ),
    totalOperationalCost: vehicleAnalytics.reduce(
      (s: number, v: any) => s + v.totalOperationalCost,
      0,
    ),
    totalFuelLiters: vehicleAnalytics.reduce(
      (s: number, v: any) => s + v.totalFuelLiters,
      0,
    ),
    fleetSize: vehicles.length,
    activeTrips: trips.filter((t: any) => t.state === "dispatched").length,
    completedTrips: trips.filter((t: any) => t.state === "completed").length,
  };

  return { vehicleAnalytics, totals, vehicles, trips, expenses, maintenance };
}
