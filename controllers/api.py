from odoo import http
from odoo.http import request
import json
import logging

_logger = logging.getLogger(__name__)

# ── Status mappings (model value → frontend value) ──────────────────────────
VEHICLE_STATUS_MAP = {
    'on_trip': 'in_use',
    'in_service': 'maintenance',
    'in_shop': 'maintenance',
    'available': 'available',
}

DRIVER_STATUS_MAP = {
    'on_duty': 'active',
    'off_duty': 'on_leave',
}

TRIP_STATE_MAP = {
    'completed': 'done',
}

# Reverse maps for writing back
TRIP_STATE_REVERSE = {v: k for k, v in TRIP_STATE_MAP.items()}


def _json_response(data, status=200):
    """Return a plain-JSON HTTP response. CORS is handled by Odoo's route decorator."""
    body = json.dumps(data, default=str)
    return request.make_response(body, headers=[('Content-Type', 'application/json')], status=status)


def _map(value, mapping):
    return mapping.get(value, value)


class FleetflowAPI(http.Controller):




    # ━━━━━━━━━ GET  /fleetflow/vehicles ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    @http.route('/fleetflow/vehicles', type='http', auth='public',
                methods=['GET'], cors='*', csrf=False)
    def get_vehicles(self, **kwargs):
        vehicles = request.env['fleetflow.vehicle'].sudo().search([])
        data = []
        for v in vehicles:
            data.append({
                'id': v.id,
                'name': v.name,
                'license_plate': v.license_plate or '',
                'vin': v.vin if hasattr(v, 'vin') and v.vin else '',
                'vehicle_type': v.vehicle_type or '',
                'fuel_type': v.fuel_type if hasattr(v, 'fuel_type') and v.fuel_type else '',
                'capacity': v.capacity if hasattr(v, 'capacity') else 0,
                'max_capacity': v.max_capacity or 0,
                'odometer': v.odometer if hasattr(v, 'odometer') else 0,
                'status': _map(v.status, VEHICLE_STATUS_MAP),
                'driver': v.driver_id.name if v.driver_id else '',
                'driver_id': v.driver_id.id if v.driver_id else False,
                'total_revenue': v.total_revenue if hasattr(v, 'total_revenue') else 0,
                'total_operational_cost': v.total_operational_cost if hasattr(v, 'total_operational_cost') else 0,
                'roi': v.roi if hasattr(v, 'roi') else 0,
            })
        return _json_response({'status': 'ok', 'count': len(data), 'data': data})

    # ━━━━━━━━━ GET  /fleetflow/drivers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    @http.route('/fleetflow/drivers', type='http', auth='public',
                methods=['GET'], cors='*', csrf=False)
    def get_drivers(self, **kwargs):
        drivers = request.env['fleetflow.driver'].sudo().search([])
        data = []
        for d in drivers:
            data.append({
                'id': d.id,
                'name': d.name,
                'license_number': d.license_number or '',
                'license_expiry': str(d.license_expiry) if d.license_expiry else '',
                'phone': d.phone if hasattr(d, 'phone') and d.phone else '',
                'status': _map(d.status, DRIVER_STATUS_MAP),
                'safety_score': d.safety_score or 0,
            })
        return _json_response({'status': 'ok', 'count': len(data), 'data': data})

    # ━━━━━━━━━ GET  /fleetflow/trips ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    @http.route('/fleetflow/trips', type='http', auth='public',
                methods=['GET'], cors='*', csrf=False)
    def get_trips(self, **kwargs):
        domain = []
        state = kwargs.get('state')
        vehicle_id = kwargs.get('vehicle_id')
        if state:
            model_state = TRIP_STATE_REVERSE.get(state, state)
            domain.append(('state', '=', model_state))
        if vehicle_id:
            domain.append(('vehicle_id', '=', int(vehicle_id)))

        trips = request.env['fleetflow.trip'].sudo().search(domain)
        data = []
        for t in trips:
            data.append({
                'id': t.id,
                'name': t.name or '',
                'vehicle': t.vehicle_id.name if t.vehicle_id else '',
                'vehicle_id': t.vehicle_id.id if t.vehicle_id else 0,
                'driver': t.driver_id.name if t.driver_id else '',
                'driver_id': t.driver_id.id if t.driver_id else 0,
                'origin': t.origin or '',
                'destination': t.destination or '',
                'cargo_weight': t.cargo_weight or 0,
                'revenue': t.revenue if hasattr(t, 'revenue') else 0,
                'state': _map(t.state, TRIP_STATE_MAP),
                'start_odometer': t.start_odometer if hasattr(t, 'start_odometer') else 0,
                'end_odometer': t.end_odometer if hasattr(t, 'end_odometer') else 0,
            })
        return _json_response({'status': 'ok', 'count': len(data), 'data': data})

    # ━━━━━━━━━ POST  /fleetflow/trip/create  (JSON-RPC) ━━━━━━━━━━━━━━━━
    @http.route('/fleetflow/trip/create', type='json', auth='public',
                methods=['POST'], cors='*', csrf=False)
    def create_trip(self, **params):
        try:
            vals = {
                'vehicle_id': int(params.get('vehicle_id', 0)),
                'driver_id': int(params.get('driver_id', 0)),
                'origin': params.get('origin', ''),
                'destination': params.get('destination', ''),
            }
            if params.get('cargo_weight'):
                vals['cargo_weight'] = float(params['cargo_weight'])
            if params.get('revenue'):
                vals['revenue'] = float(params['revenue'])
            if params.get('start_odometer'):
                vals['start_odometer'] = float(params['start_odometer'])

            trip = request.env['fleetflow.trip'].sudo().create(vals)
            return {
                'status': 'ok',
                'message': f'Trip {trip.name} created successfully',
                'data': {
                    'id': trip.id,
                    'name': trip.name,
                    'state': _map(trip.state, TRIP_STATE_MAP),
                },
            }
        except Exception as e:
            _logger.exception('Trip creation failed')
            return {'status': 'error', 'message': str(e)}

    # ━━━━━━━━━ POST  /fleetflow/trip/dispatch  (JSON-RPC) ━━━━━━━━━━━━━━
    @http.route('/fleetflow/trip/dispatch', type='json', auth='public',
                methods=['POST'], cors='*', csrf=False)
    def dispatch_trip(self, **params):
        try:
            trip_id = int(params.get('trip_id', 0))
            trip = request.env['fleetflow.trip'].sudo().browse(trip_id)
            if not trip.exists():
                return {'status': 'error', 'message': 'Trip not found'}
            trip.action_dispatch()
            return {
                'status': 'ok',
                'message': f'{trip.name} dispatched successfully',
            }
        except Exception as e:
            _logger.exception('Trip dispatch failed')
            return {'status': 'error', 'message': str(e)}

    # ━━━━━━━━━ POST  /fleetflow/trip/complete  (JSON-RPC) ━━━━━━━━━━━━━━
    @http.route('/fleetflow/trip/complete', type='json', auth='public',
                methods=['POST'], cors='*', csrf=False)
    def complete_trip(self, **params):
        try:
            trip_id = int(params.get('trip_id', 0))
            trip = request.env['fleetflow.trip'].sudo().browse(trip_id)
            if not trip.exists():
                return {'status': 'error', 'message': 'Trip not found'}

            update_vals = {}
            if params.get('end_odometer'):
                update_vals['end_odometer'] = float(params['end_odometer'])
            if params.get('revenue'):
                update_vals['revenue'] = float(params['revenue'])
            if update_vals:
                trip.write(update_vals)

            trip.action_complete()
            return {
                'status': 'ok',
                'message': f'{trip.name} completed successfully',
            }
        except Exception as e:
            _logger.exception('Trip completion failed')
            return {'status': 'error', 'message': str(e)}

    # ━━━━━━━━━ POST  /fleetflow/vehicle/create  (JSON-RPC) ━━━━━━━━━━━━━
    @http.route('/fleetflow/vehicle/create', type='json', auth='public',
                methods=['POST'], cors='*', csrf=False)
    def create_vehicle(self, **params):
        try:
            vals = {
                'name': params.get('name'),
                'license_plate': params.get('license_plate'),
                'vehicle_type': params.get('vehicle_type', 'truck'),
            }
            if params.get('vin'):
                vals['vin'] = params['vin']
            if params.get('max_capacity'):
                vals['max_capacity'] = float(params['max_capacity'])
            if params.get('odometer'):
                vals['odometer'] = float(params['odometer'])
            if params.get('fuel_type'):
                vals['fuel_type'] = params['fuel_type']

            vehicle = request.env['fleetflow.vehicle'].sudo().create(vals)
            return {
                'status': 'ok',
                'message': f'Vehicle {vehicle.name} created successfully',
                'data': {
                    'id': vehicle.id,
                    'name': vehicle.name,
                    'status': _map(vehicle.status, VEHICLE_STATUS_MAP),
                },
            }
        except Exception as e:
            _logger.exception('Vehicle creation failed')
            return {'status': 'error', 'message': str(e)}

    # ━━━━━━━━━ POST  /fleetflow/driver/create  (JSON-RPC) ━━━━━━━━━━━━━━
    @http.route('/fleetflow/driver/create', type='json', auth='public',
                methods=['POST'], cors='*', csrf=False)
    def create_driver(self, **params):
        try:
            vals = {
                'name': params.get('name'),
                'license_number': params.get('license_number'),
            }
            if params.get('license_category'):
                vals['license_category'] = params['license_category']
            if params.get('license_expiry'):
                vals['license_expiry'] = params['license_expiry']
            if params.get('phone'):
                vals['phone'] = params['phone']

            driver = request.env['fleetflow.driver'].sudo().create(vals)
            return {
                'status': 'ok',
                'message': f'Driver {driver.name} created successfully',
                'data': {
                    'id': driver.id,
                    'name': driver.name,
                    'status': _map(driver.status, DRIVER_STATUS_MAP),
                },
            }
        except Exception as e:
            _logger.exception('Driver creation failed')
            return {'status': 'error', 'message': str(e)}
    # ━━━━━━━━━ GET  /fleetflow/maintenance ━━━━━━━━━━━━━━━━━━━━━━━━━━
    @http.route('/fleetflow/maintenance', type='http', auth='public',
                methods=['GET'], cors='*', csrf=False)
    def get_maintenance(self, **kwargs):
        logs = request.env['fleetflow.maintenance'].sudo().search([])
        data = []
        for l in logs:
            data.append({
                'id': l.id,
                'vehicle': l.vehicle_id.name,
                'vehicle_id': l.vehicle_id.id,
                'issue': l.issue or '',
                'cost': l.cost or 0,
                'date': str(l.service_date) if l.service_date else '',
            })
        return _json_response({'status': 'ok', 'count': len(data), 'data': data})

    # ━━━━━━━━━ POST  /fleetflow/maintenance/create  (JSON-RPC) ━━━━━━━
    @http.route('/fleetflow/maintenance/create', type='json', auth='public',
                methods=['POST'], cors='*', csrf=False)
    def create_maintenance(self, **params):
        try:
            vals = {
                'vehicle_id': int(params.get('vehicle_id', 0)),
                'issue': params.get('issue', ''),
                'cost': float(params.get('cost', 0.0)),
            }
            if params.get('date'):
                vals['service_date'] = params['date']
            
            log = request.env['fleetflow.maintenance'].sudo().create(vals)
            return {
                'status': 'ok',
                'message': f'Maintenance log for {log.vehicle_id.name} created',
                'data': {'id': log.id}
            }
        except Exception as e:
            _logger.exception('Maintenance creation failed')
            return {'status': 'error', 'message': str(e)}

    # ━━━━━━━━━ GET  /fleetflow/expenses ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    @http.route('/fleetflow/expenses', type='http', auth='public',
                methods=['GET'], cors='*', csrf=False)
    def get_expenses(self, **kwargs):
        expenses = request.env['fleetflow.expense'].sudo().search([])
        data = []
        for e in expenses:
            data.append({
                'id': e.id,
                'vehicle': e.vehicle_id.name,
                'vehicle_id': e.vehicle_id.id,
                'trip': e.trip_id.name if e.trip_id else 'General',
                'liters': e.liters or 0,
                'cost': e.fuel_cost or 0,
                'date': str(e.expense_date) if e.expense_date else '',
            })
        return _json_response({'status': 'ok', 'count': len(data), 'data': data})

    # ━━━━━━━━━ POST  /fleetflow/expense/create  (JSON-RPC) ━━━━━━━━━━
    @http.route('/fleetflow/expense/create', type='json', auth='public',
                methods=['POST'], cors='*', csrf=False)
    def create_expense(self, **params):
        try:
            vals = {
                'vehicle_id': int(params.get('vehicle_id', 0)),
                'liters': float(params.get('liters', 0.0)),
                'fuel_cost': float(params.get('cost', 0.0)),
            }
            if params.get('trip_id'):
                vals['trip_id'] = int(params['trip_id'])
            if params.get('date'):
                vals['expense_date'] = params['date']

            expense = request.env['fleetflow.expense'].sudo().create(vals)
            return {
                'status': 'ok',
                'message': f'Expense for {expense.vehicle_id.name} recorded',
                'data': {'id': expense.id}
            }
        except Exception as e:
            _logger.exception('Expense creation failed')
            return {'status': 'error', 'message': str(e)}
