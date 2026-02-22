from odoo import models, fields, api
from odoo.exceptions import ValidationError
from datetime import date


class FleetFlowDriver(models.Model):
    _name = 'fleetflow.driver'
    _description = 'FleetFlow Driver'

    name = fields.Char(required=True)
    license_number = fields.Char()
    license_expiry = fields.Date()
    license_category = fields.Selection([
        ('car', 'Car'),
        ('truck', 'Truck'),
        ('van', 'Van'),
        ('bus', 'Bus'),
        ('other', 'Other'),
    ], string='License Category', default='car', required=True)
    phone = fields.Char()
    status = fields.Selection([
        ('on_duty', 'On Duty'),
        ('off_duty', 'Off Duty'),
        ('suspended', 'Suspended')
    ], default='off_duty', required=True)
    safety_score = fields.Float(compute='_compute_safety_score', store=True)
    completion_rate = fields.Float(compute='_compute_completion_rate', store=True)
    is_license_expired = fields.Boolean(compute='_compute_is_license_expired')
    trip_ids = fields.One2many('fleetflow.trip', 'driver_id', string='Trips')
    company_id = fields.Many2one('res.company', string='Company', default=lambda self: self.env.company)

    @api.depends('trip_ids.state', 'license_expiry')
    def _compute_completion_rate(self):
        for record in self:
            total = len(record.trip_ids)
            if total > 0:
                completed = len(record.trip_ids.filtered(lambda t: t.state == 'completed'))
                record.completion_rate = (completed / total) * 100.0
            else:
                record.completion_rate = 0.0

    @api.depends('completion_rate', 'license_expiry')
    def _compute_safety_score(self):
        today = date.today()
        for record in self:
            # Base score is completion rate (0-100)
            score = record.completion_rate
            
            # Penalty for expired license
            if record.license_expiry and record.license_expiry < today:
                score -= 20.0
            
            # Ensure score stays in 0-100 range
            record.safety_score = max(0.0, min(100.0, score))

    @api.depends('license_expiry')
    def _compute_is_license_expired(self):
        today = date.today()
        for record in self:
            record.is_license_expired = record.license_expiry and record.license_expiry < today

    @api.constrains('license_expiry')
    def _check_license_expiry(self):
        for record in self:
            if record.license_expiry and record.license_expiry < date.today():
                raise ValidationError("Driver license has expired. Please renew it before assigning any trips.")
