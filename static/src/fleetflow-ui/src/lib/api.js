export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8069";

// ── Demo / Mock Data ──────────────────────────────────────────────────
// Used as fallback when Odoo backend is unreachable so the UI still works.

let _nextId = 100;
const nextId = () => ++_nextId;

const MOCK_VEHICLES = [];
const MOCK_DRIVERS = [];
const MOCK_TRIPS = [];
const MOCK_MAINTENANCE = [];
const MOCK_EXPENSES = [];


// Mutable copies so create operations persist during session
let mockVehicles = [...MOCK_VEHICLES];
let mockDrivers = [...MOCK_DRIVERS];
let mockTrips = [...MOCK_TRIPS];
let mockMaintenance = [...MOCK_MAINTENANCE];
let mockExpenses = [...MOCK_EXPENSES];

// ── Helper: Generic Fetch (with demo fallback) ───────────────────────
async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error(`[API Fetch Error] ${endpoint}:`, error);
    // Odoo backend unreachable — return demo data
    return demoBranch(endpoint);
  }
}

// ── Helper: JSON-RPC (with demo fallback) ─────────────────────────────
async function apiPostJson(endpoint, params = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonrpcPayload(params)
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message || "JSON-RPC Error");
    return data.result;
  } catch (error) {
    console.error(`[API Mutate Error] ${endpoint}:`, error);
    return demoMutate(endpoint, params);
  }
}

function jsonrpcPayload(params) {
  return JSON.stringify({
    jsonrpc: "2.0",
    method: "call",
    params: params,
    id: Math.floor(Math.random() * 1000000)
  });
}

// ── Demo routing ──────────────────────────────────────────────────────
function demoBranch(endpoint) {
  const path = endpoint.split("?")[0];
  switch (path) {
    case "/fleetflow/vehicles":
      return { data: mockVehicles };
    case "/fleetflow/drivers":
      return { data: mockDrivers };
    case "/fleetflow/trips":
      return { data: mockTrips };
    case "/fleetflow/maintenance":
      return { data: mockMaintenance };
    case "/fleetflow/expenses":
      return { data: mockExpenses };
    default:
      return { data: [] };
  }
}

function demoMutate(endpoint, params) {
  switch (endpoint) {
    case "/fleetflow/vehicle/create": {
      const v = {
        id: nextId(),
        status: "available",
        odometer: 0,
        region: "West",
        acquisition_cost: 0,
        total_revenue: 0,
        total_operational_cost: 0,
        roi: 0,
        ...params
      };
      mockVehicles = [...mockVehicles, v];
      return v;
    }
    case "/fleetflow/vehicle/toggle_oos": {
      mockVehicles = mockVehicles.map((v) =>
        v.id === params.vehicle_id ?
          {
            ...v,
            status:
              v.status === "out_of_service" ? "available" : "out_of_service"
          } :
          v
      );
      return { success: true };
    }
    case "/fleetflow/driver/create": {
      const d = {
        id: nextId(),
        status: "on_duty",
        safety_score: 80,
        trips_completed: 0,
        trips_total: 0,
        ...params
      };
      mockDrivers = [...mockDrivers, d];
      return d;
    }
    case "/fleetflow/driver/toggle_status": {
      mockDrivers = mockDrivers.map((d) =>
        d.id === params.driver_id ? { ...d, status: params.status } : d
      );
      return { success: true };
    }
    case "/fleetflow/trip/create": {
      // Cargo weight validation
      const vehicle = mockVehicles.find((v) => v.id === params.vehicle_id);
      const driver = mockDrivers.find((d) => d.id === params.driver_id);
      if (vehicle && params.cargo_weight > vehicle.max_capacity) {
        throw new Error(
          `Cargo weight (${params.cargo_weight}T) exceeds vehicle capacity (${vehicle.max_capacity}T)`
        );
      }
      // Block expired license
      if (
        driver &&
        driver.license_expiry &&
        new Date(driver.license_expiry) < new Date()) {
        throw new Error(
          `Driver ${driver.name}'s license has expired. Cannot assign to trip.`
        );
      }
      const t = {
        id: nextId(),
        name: `TRIP/2026/${String(mockTrips.length + 1).padStart(3, "0")}`,
        vehicle: vehicle?.name ?? "",
        driver: driver?.name ?? "",
        state: "draft",
        ...params
      };
      mockTrips = [...mockTrips, t];
      return t;
    }
    case "/fleetflow/trip/dispatch": {
      const trip = mockTrips.find((t) => t.id === params.trip_id);
      // Update trip state
      mockTrips = mockTrips.map((t) =>
        t.id === params.trip_id ? { ...t, state: "dispatched" } : t
      );
      // Auto-update: Vehicle → in_use, Driver → on_trip
      if (trip) {
        mockVehicles = mockVehicles.map((v) =>
          v.id === trip.vehicle_id ? { ...v, status: "in_use" } : v
        );
        mockDrivers = mockDrivers.map((d) =>
          d.id === trip.driver_id ? { ...d, status: "on_trip" } : d
        );
      }
      return { success: true };
    }
    case "/fleetflow/trip/complete": {
      const trip = mockTrips.find((t) => t.id === params.trip_id);
      mockTrips = mockTrips.map((t) =>
        t.id === params.trip_id ?
          { ...t, state: "completed", end_odometer: params.end_odometer } :
          t
      );
      // Auto-update: Vehicle → available, Driver → on_duty
      if (trip) {
        mockVehicles = mockVehicles.map((v) =>
          v.id === trip.vehicle_id ?
            {
              ...v,
              status: "available",
              odometer: params.end_odometer || v.odometer
            } :
            v
        );
        mockDrivers = mockDrivers.map((d) =>
          d.id === trip.driver_id ? { ...d, status: "on_duty" } : d
        );
      }
      return { success: true };
    }
    case "/fleetflow/trip/cancel": {
      const trip = mockTrips.find((t) => t.id === params.trip_id);
      mockTrips = mockTrips.map((t) =>
        t.id === params.trip_id ? { ...t, state: "cancelled" } : t
      );
      // If it was dispatched, free up vehicle & driver
      if (trip && trip.state === "dispatched") {
        mockVehicles = mockVehicles.map((v) =>
          v.id === trip.vehicle_id ? { ...v, status: "available" } : v
        );
        mockDrivers = mockDrivers.map((d) =>
          d.id === trip.driver_id ? { ...d, status: "on_duty" } : d
        );
      }
      return { success: true };
    }
    case "/fleetflow/maintenance/create": {
      const vehicle = mockVehicles.find((v) => v.id === params.vehicle_id);
      const m = {
        id: nextId(),
        vehicle: vehicle?.name ?? "",
        date: new Date().toISOString().slice(0, 10),
        ...params
      };
      mockMaintenance = [...mockMaintenance, m];
      // Auto-logic: Vehicle → maintenance (In Shop)
      mockVehicles = mockVehicles.map((v) =>
        v.id === params.vehicle_id ? { ...v, status: "maintenance" } : v
      );
      return m;
    }
    case "/fleetflow/expense/create": {
      const vehicle = mockVehicles.find((v) => v.id === params.vehicle_id);
      const trip = mockTrips.find((t) => t.id === params.trip_id);
      const e = {
        id: nextId(),
        vehicle: vehicle?.name ?? "",
        trip: trip?.name ?? null,
        date: new Date().toISOString().slice(0, 10),
        ...params
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
  const res = await apiFetch("/fleetflow/vehicles");
  return res.data;
}

export async function createVehicle(data) {
  return apiPostJson("/fleetflow/vehicle/create", data);
}

// ── Drivers ─────────────────────────────────────────────────────────
export async function getDrivers() {
  const res = await apiFetch("/fleetflow/drivers");
  return res.data;
}

export async function createDriver(data) {
  return apiPostJson("/fleetflow/driver/create", data);
}

// ── Trips ───────────────────────────────────────────────────────────
export async function getTrips(state) {
  const endpoint = state ?
    `/fleetflow/trips?state=${state}` :
    "/fleetflow/trips";
  const res = await apiFetch(endpoint);
  return res.data;
}

export async function createTrip(data) {
  return apiPostJson("/fleetflow/trip/create", data);
}

export async function dispatchTrip(tripId) {
  return apiPostJson("/fleetflow/trip/dispatch", { trip_id: tripId });
}

export async function completeTrip(params) {
  return apiPostJson("/fleetflow/trip/complete", params);
}
// ── Maintenance ────────────────────────────────────────────────────
export async function getMaintenance() {
  const res = await apiFetch("/fleetflow/maintenance");
  return res.data;
}

export async function createMaintenance(data) {
  return apiPostJson("/fleetflow/maintenance/create", data);
}

// ── Expenses ───────────────────────────────────────────────────────
export async function getExpenses() {
  const res = await apiFetch("/fleetflow/expenses");
  return res.data;
}

export async function createExpense(data) {
  return apiPostJson("/fleetflow/expense/create", data);
}

// ── Vehicle Toggle Out-of-Service ──────────────────────────────────
export async function toggleVehicleOOS(vehicleId) {
  return apiPostJson("/fleetflow/vehicle/toggle_oos", {
    vehicle_id: vehicleId
  });
}

// ── Driver Status Toggle ───────────────────────────────────────────
export async function toggleDriverStatus(driverId, status) {
  return apiPostJson("/fleetflow/driver/toggle_status", {
    driver_id: driverId,
    status
  });
}

// ── Cancel Trip ────────────────────────────────────────────────────
export async function cancelTrip(tripId) {
  return apiPostJson("/fleetflow/trip/cancel", { trip_id: tripId });
}

// ── Analytics helpers (computed from mock data) ────────────────────
export async function getAnalytics() {
  const [vehicles, trips, expenses, maintenance] = await Promise.all([
    getVehicles(),
    getTrips(),
    getExpenses(),
    getMaintenance()]
  );

  // Fuel efficiency per vehicle
  const vehicleAnalytics = vehicles.map((v) => {
    const vExpenses = expenses.filter((e) => e.vehicle_id === v.id);
    const vMaintenance = maintenance.filter((m) => m.vehicle_id === v.id);
    const vTrips = trips.filter(
      (t) => t.vehicle_id === v.id && t.state === "completed"
    );

    const totalFuelCost = vExpenses.reduce(
      (s, e) => s + (e.cost || 0),
      0
    );
    const totalFuelLiters = vExpenses.reduce(
      (s, e) => s + (e.liters || 0),
      0
    );
    const totalMaintenanceCost = vMaintenance.reduce(
      (s, m) => s + (m.cost || 0),
      0
    );
    const totalOperationalCost = totalFuelCost + totalMaintenanceCost;
    const revenue = v.total_revenue || 0;
    const acquisitionCost = v.acquisition_cost || 1;
    const roi =
      acquisitionCost > 0 ?
        ((revenue - totalOperationalCost) / acquisitionCost * 100).toFixed(
          1
        ) :
        0;
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
      tripsCompleted: vTrips.length
    };
  });

  const totals = {
    totalRevenue: vehicleAnalytics.reduce(
      (s, v) => s + v.revenue,
      0
    ),
    totalFuelCost: vehicleAnalytics.reduce(
      (s, v) => s + v.totalFuelCost,
      0
    ),
    totalMaintenanceCost: vehicleAnalytics.reduce(
      (s, v) => s + v.totalMaintenanceCost,
      0
    ),
    totalOperationalCost: vehicleAnalytics.reduce(
      (s, v) => s + v.totalOperationalCost,
      0
    ),
    totalFuelLiters: vehicleAnalytics.reduce(
      (s, v) => s + v.totalFuelLiters,
      0
    ),
    fleetSize: vehicles.length,
    activeTrips: trips.filter((t) => t.state === "dispatched").length,
    completedTrips: trips.filter((t) => t.state === "completed").length
  };

  return { vehicleAnalytics, totals, vehicles, trips, expenses, maintenance };
}