from odoo import api, fields, models


class FleetflowDashboard(models.Model):
    _name = 'fleetflow.dashboard'
    _description = 'Fleet Dashboard'

    name = fields.Char(required=True, default='Fleet Dashboard')
    company_id = fields.Many2one('res.company', required=True, default=lambda self: self.env.company)
    currency_id = fields.Many2one(related='company_id.currency_id', store=True, readonly=True)

    active_fleet_count = fields.Integer(compute='_compute_dashboard_metrics')
    vehicles_in_shop = fields.Integer(compute='_compute_dashboard_metrics')
    utilization_rate = fields.Float(compute='_compute_dashboard_metrics')
    pending_trips = fields.Integer(compute='_compute_dashboard_metrics')
    total_revenue = fields.Monetary(currency_field='currency_id', compute='_compute_dashboard_metrics')
    total_operational_cost = fields.Monetary(currency_field='currency_id', compute='_compute_dashboard_metrics')

    def get_dashboard_data(self):
        self.ensure_one()

        vehicle_obj = self.env['fleetflow.vehicle']
        trip_obj = self.env['fleetflow.trip']

        fleet_domain = [
            ('company_id', '=', self.company_id.id),
            ('status', 'not in', ('inactive', 'retired')),
        ]
        active_fleet_count = vehicle_obj.search_count(fleet_domain)

        vehicles_in_shop = vehicle_obj.search_count([
            ('company_id', '=', self.company_id.id),
            ('status', '=', 'in_shop'),
        ])

        on_trip_count = vehicle_obj.search_count([
            ('company_id', '=', self.company_id.id),
            ('status', '=', 'on_trip'),
        ])
        utilization_rate = (on_trip_count / active_fleet_count * 100.0) if active_fleet_count else 0.0

        pending_trips = trip_obj.search_count([
            ('company_id', '=', self.company_id.id),
            ('state', 'in', ('draft', 'dispatched')),
        ])

        revenue_result = trip_obj.read_group(
            domain=[('company_id', '=', self.company_id.id), ('state', '=', 'completed')],
            fields=['revenue'],
            groupby=[],
        )
        total_revenue = revenue_result[0].get('revenue', 0.0) if revenue_result else 0.0

        operational_cost_result = vehicle_obj.read_group(
            domain=[('company_id', '=', self.company_id.id)],
            fields=['total_operational_cost'],
            groupby=[],
        )
        total_operational_cost = operational_cost_result[0].get('total_operational_cost', 0.0) if operational_cost_result else 0.0

        return {
            'active_fleet_count': active_fleet_count,
            'vehicles_in_shop': vehicles_in_shop,
            'utilization_rate': utilization_rate,
            'pending_trips': pending_trips,
            'total_revenue': total_revenue,
            'total_operational_cost': total_operational_cost,
        }

    @api.depends_context('uid', 'allowed_company_ids')
    def _compute_dashboard_metrics(self):
        for record in self:
            data = record.get_dashboard_data()
            record.active_fleet_count = data['active_fleet_count']
            record.vehicles_in_shop = data['vehicles_in_shop']
            record.utilization_rate = data['utilization_rate']
            record.pending_trips = data['pending_trips']
            record.total_revenue = data['total_revenue']
            record.total_operational_cost = data['total_operational_cost']
