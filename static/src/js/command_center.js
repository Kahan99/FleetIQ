/** @odoo-module **/

/**
 * FleetIQ – Command Center Client Action (Odoo 17 / OWL 2)
 *
 * Registers as the "FleetIQ_command_center" client action tag.
 * Fetches KPI data from /FleetIQ/command_center/data via JSON-RPC.
 * QWeb template is in static/src/xml/command_center.xml.
 */

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, useState, onMounted, onWillUnmount } from "@odoo/owl";

// ── Constants ────────────────────────────────────────────────────────
const VEHICLE_TYPES = ["", "truck", "van", "car", "bus", "other"];
const VEHICLE_STATUS = ["", "available", "on_trip", "in_service", "in_shop", "maintenance", "inactive"];

const TYPE_LABEL = {
  "": "All Types", truck: "Truck", van: "Van",
  car: "Car", bus: "Bus", other: "Other",
};

const STATUS_LABEL = {
  "": "All Statuses", available: "Available", on_trip: "On Trip",
  in_service: "In Service", in_shop: "In Shop",
  maintenance: "Under Maintenance", inactive: "Inactive",
};

const TRIP_STATE_LABEL = {
  draft: "Draft", dispatched: "Dispatched",
  completed: "Completed", cancelled: "Cancelled",
};

// ── OWL Component ────────────────────────────────────────────────────
export class CommandCenterDashboard extends Component {
  static template = "FleetIQ.CommandCenter";
  static props = {};

  setup() {
    this.rpc = useService("rpc");

    this.state = useState({
      loading: true,
      error: null,
      active_fleet: 0,
      alerts: 0,
      utilization: 0.0,
      pending_cargo: 0,
      total_vehicles: 0,
      status_breakdown: {},
      type_breakdown: {},
      recent_trips: [],
      shop_vehicles: [],
      vehicle_type: "",
      vehicle_status: "",
      last_updated: "",
    });

    this._refreshInterval = null;

    onMounted(() => {
      this._load();
      this._refreshInterval = setInterval(() => this._load(), 60_000);
    });

    onWillUnmount(() => {
      if (this._refreshInterval) {
        clearInterval(this._refreshInterval);
      }
    });
  }

  async _load() {
    this.state.loading = true;
    this.state.error = null;
    try {
      const payload = {
        vehicle_type: this.state.vehicle_type || null,
        vehicle_status: this.state.vehicle_status || null,
      };
      const result = await this.rpc("/FleetIQ/command_center/data", payload);

      if (!result || result.error) {
        this.state.error = (result && result.message) || "Server error. Please retry.";
        return;
      }

      Object.assign(this.state, {
        active_fleet: result.active_fleet_count ?? 0,
        alerts: result.maintenance_alerts ?? 0,
        utilization: result.utilization_rate ?? 0,
        pending_cargo: result.pending_cargo ?? 0,
        total_vehicles: result.total_vehicles ?? 0,
        status_breakdown: result.status_breakdown ?? {},
        type_breakdown: result.type_breakdown ?? {},
        recent_trips: result.recent_trips ?? [],
        shop_vehicles: result.shop_vehicles ?? [],
        last_updated: new Date().toLocaleTimeString(),
      });
    } catch (e) {
      this.state.error = "Failed to fetch dashboard data. Check your connection.";
    } finally {
      this.state.loading = false;
    }
  }

  // ── Event handlers ───────────────────────────────────────────────
  onTypeChange(ev) {
    this.state.vehicle_type = ev.target.value;
    this._load();
  }

  onStatusChange(ev) {
    this.state.vehicle_status = ev.target.value;
    this._load();
  }

  onRefresh() {
    this._load();
  }

  // ── Template helpers ─────────────────────────────────────────────
  get vehicleTypes() { return VEHICLE_TYPES; }
  get vehicleStatuses() { return VEHICLE_STATUS; }

  typeLabel(k) { return TYPE_LABEL[k] ?? k; }
  statusLabel(k) { return STATUS_LABEL[k] ?? k; }
  tripStateLabel(k) { return TRIP_STATE_LABEL[k] ?? k; }

  fmt(n, decimals = 0) {
    if (n === undefined || n === null) return "—";
    return Number(n).toFixed(decimals);
  }

  utilizationColorClass() {
    const u = this.state.utilization;
    if (u >= 70) return "ff-kpi-success";
    if (u >= 40) return "ff-kpi-warning";
    return "ff-kpi-info";
  }

  alertColorClass() {
    return this.state.alerts > 0 ? "ff-kpi-danger" : "ff-kpi-success";
  }

  pct(count) {
    const total = this.state.total_vehicles;
    if (!total) return 0;
    return Math.min(Math.round(count / total * 100), 100);
  }

  tripStateBadgeClass(state) {
    return {
      draft: "ff-badge ff-badge-warning",
      dispatched: "ff-badge ff-badge-info",
      completed: "ff-badge ff-badge-success",
      cancelled: "ff-badge ff-badge-muted",
    }[state] ?? "ff-badge";
  }
}

// ── Register as Odoo client action ───────────────────────────────────
registry.category("actions").add("FleetIQ_command_center", CommandCenterDashboard);
