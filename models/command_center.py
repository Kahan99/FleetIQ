from odoo import api, models


class FleetCommandCenter(models.Model):
    """
    Command Center helper — thin model-level service that exposes
    real-time KPI computation with optional filter support.
    Attached to the existing fleetflow.vehicle model via _inherit
    so we can call it from a controller without modifying dashboard.py.
    We use a separate class extending transient so no DB table is created.
    """
    _inherit = 'fleetflow.vehicle'

    @api.model
    def get_command_center_data(self, vehicle_type=None, vehicle_status=None):
        """
        Return Command Center KPIs, optionally filtered by vehicle_type
        and / or vehicle_status.

        :param vehicle_type: str|None  – one of 'car','truck','van','bus','other'
        :param vehicle_status: str|None – one of the status selection values
        :return: dict with KPI values and breakdown lists
        """
        Vehicle = self.env['fleetflow.vehicle']
        Trip    = self.env['fleetflow.trip']
        company_id = self.env.company.id

        # ── Base domain (always scoped to current company) ────────────
        base_domain = [('company_id', '=', company_id)]

        if vehicle_type:
            base_domain.append(('vehicle_type', '=', vehicle_type))

        # ── KPI 1 – Active Fleet (on_trip) ────────────────────────────
        active_domain = base_domain + [('status', '=', 'on_trip')]
        active_fleet_count = Vehicle.search_count(active_domain)

        # ── KPI 2 – Maintenance Alerts (in_shop) ─────────────────────
        alert_domain = base_domain + [('status', '=', 'in_shop')]
        maintenance_alerts = Vehicle.search_count(alert_domain)

        # ── KPI 3 – Utilization Rate ──────────────────────────────────
        # Total excludes retired/inactive so the ratio is meaningful
        total_domain = base_domain + [('status', 'not in', ['inactive', 'retired'])]
        total_vehicles = Vehicle.search_count(total_domain)
        utilization_rate = (
            round(active_fleet_count / total_vehicles * 100.0, 1)
            if total_vehicles else 0.0
        )

        # ── KPI 4 – Pending Cargo (draft trips) ──────────────────────
        trip_domain = [('company_id', '=', company_id), ('state', '=', 'draft')]
        pending_cargo = Trip.search_count(trip_domain)

        # ── Breakdown: vehicles by status (for filter bar hint) ───────
        status_breakdown = {}
        for sv in ('available', 'on_trip', 'in_service', 'in_shop',
                   'maintenance', 'inactive', 'retired'):
            status_breakdown[sv] = Vehicle.search_count(
                base_domain + [('status', '=', sv)]
            )

        # ── Breakdown: vehicles by type ───────────────────────────────
        type_breakdown = {}
        for tv in ('car', 'truck', 'van', 'bus', 'other'):
            type_breakdown[tv] = Vehicle.search_count(
                [('company_id', '=', company_id), ('vehicle_type', '=', tv)]
            )

        # ── Recent active trips for the live feed table ───────────────
        recent_trips = Trip.search_read(
            domain=[('company_id', '=', company_id),
                    ('state', 'in', ['draft', 'dispatched'])],
            fields=['name', 'state', 'origin', 'destination',
                    'cargo_weight', 'vehicle_id', 'driver_id'],
            limit=10,
            order='id desc',
        )

        # ── Vehicles currently in shop (alert list) ───────────────────
        shop_vehicles = Vehicle.search_read(
            domain=[('company_id', '=', company_id), ('status', '=', 'in_shop')],
            fields=['name', 'license_plate', 'vehicle_type', 'status'],
            limit=10,
        )

        return {
            # KPIs
            'active_fleet_count':  active_fleet_count,
            'maintenance_alerts':  maintenance_alerts,
            'utilization_rate':    utilization_rate,
            'pending_cargo':       pending_cargo,
            'total_vehicles':      total_vehicles,
            # Breakdowns
            'status_breakdown':    status_breakdown,
            'type_breakdown':      type_breakdown,
            # Live data
            'recent_trips':        recent_trips,
            'shop_vehicles':       shop_vehicles,
            # Echo back applied filters
            'filters': {
                'vehicle_type':   vehicle_type,
                'vehicle_status': vehicle_status,
            },
        }
