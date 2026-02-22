from odoo import api, fields, models
from odoo.exceptions import ValidationError


class FleetIQExpense(models.Model):
    _name = 'FleetIQ.expense'
    _description = 'Fleet Expense'

    vehicle_id = fields.Many2one('FleetIQ.vehicle', required=True, ondelete='cascade')
    trip_id = fields.Many2one('FleetIQ.trip', required=False, ondelete='cascade', domain="[('vehicle_id', '=', vehicle_id)]")
    company_id = fields.Many2one(related='vehicle_id.company_id', store=True, readonly=True)
    trip_state = fields.Selection(related='trip_id.state', store=True, readonly=True)
    liters = fields.Float(required=True, default=0.0)
    fuel_cost = fields.Float(required=True, default=0.0)
    expense_date = fields.Date(required=True, default=fields.Date.context_today)

    cost_per_km = fields.Float(compute='_compute_cost_per_km', store=True)

    @api.depends('fuel_cost', 'trip_id.start_odometer', 'trip_id.end_odometer')
    def _compute_cost_per_km(self):
        for record in self:
            distance = (record.trip_id.end_odometer or 0.0) - (record.trip_id.start_odometer or 0.0)
            record.cost_per_km = (record.fuel_cost / distance) if distance > 0 else 0.0

    @api.constrains('vehicle_id', 'trip_id')
    def _check_trip_vehicle_consistency(self):
        for record in self:
            if record.trip_id and record.vehicle_id and record.trip_id.vehicle_id != record.vehicle_id:
                raise ValidationError('Trip vehicle must match the selected vehicle.')

    @api.constrains('liters', 'fuel_cost')
    def _check_non_negative_costs(self):
        for record in self:
            if record.liters < 0:
                raise ValidationError('Liters cannot be negative.')
            if record.fuel_cost < 0:
                raise ValidationError('Fuel cost cannot be negative.')
