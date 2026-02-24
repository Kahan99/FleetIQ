from odoo import api, fields, models
from odoo.exceptions import ValidationError


class FleetflowVehicle(models.Model):
    _name = 'fleetflow.vehicle'
    _description = 'Fleet Vehicle'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'name'

    name = fields.Char(required=True, tracking=True)
    license_plate = fields.Char(required=True, copy=False, index=True, tracking=True)
    vin = fields.Char(copy=False, index=True)
    vehicle_type = fields.Selection(
        [
            ('car', 'Car'),
            ('truck', 'Truck'),
            ('van', 'Van'),
            ('bus', 'Bus'),
            ('other', 'Other'),
        ],
        required=True,
        default='car',
        tracking=True,
    )
    fuel_type = fields.Selection(
        [
            ('petrol', 'Petrol'),
            ('diesel', 'Diesel'),
            ('cng', 'CNG'),
            ('electric', 'Electric'),
            ('hybrid', 'Hybrid'),
        ],
        default='diesel',
        tracking=True,
    )
    capacity = fields.Integer(string='Capacity', tracking=True)
    max_capacity = fields.Float(string='Max Capacity (Tons)', tracking=True)
    odometer = fields.Float(tracking=True)
    acquisition_cost = fields.Monetary(default=0.0, tracking=True)
    status = fields.Selection(
        [
            ('available', 'Available'),
            ('on_trip', 'On Trip'),
            ('in_service', 'In Service'),
            ('in_shop', 'In Shop'),
            ('maintenance', 'Under Maintenance'),
            ('inactive', 'Inactive'),
            ('retired', 'Retired'),
        ],
        default='available',
        required=True,
        tracking=True,
    )
    active = fields.Boolean(default=True)

    company_id = fields.Many2one(
        'res.company',
        required=True,
        default=lambda self: self.env.company,
        index=True,
    )
    currency_id = fields.Many2one(related='company_id.currency_id', store=True, readonly=True)

    driver_id = fields.Many2one('fleetflow.driver', tracking=True)
    trip_ids = fields.One2many('fleetflow.trip', 'vehicle_id', string='Trips')
    maintenance_ids = fields.One2many('fleetflow.maintenance', 'vehicle_id', string='Maintenance')
    expense_ids = fields.One2many('fleetflow.expense', 'vehicle_id', string='Expenses')

    trip_count = fields.Integer(compute='_compute_trip_count', store=True)
    maintenance_cost_total = fields.Monetary(compute='_compute_maintenance_cost_total', store=True)
    total_fuel_cost = fields.Monetary(compute='_compute_total_fuel_cost', store=True)
    total_maintenance_cost = fields.Monetary(compute='_compute_total_maintenance_cost', store=True)
    total_operational_cost = fields.Monetary(compute='_compute_total_operational_cost', store=True)
    total_revenue = fields.Monetary(compute='_compute_total_revenue', store=True)
    total_liters = fields.Float(compute='_compute_total_liters', store=True)
    fuel_efficiency = fields.Float(compute='_compute_fuel_efficiency', string='Fuel Efficiency (Km/L)', store=True)
    roi = fields.Float(compute='_compute_roi', store=True)

    _sql_constraints = [
        ('FleetIQ_vehicle_license_plate_unique', 'unique(license_plate)', 'License plate must be unique.'),
        ('FleetIQ_vehicle_vin_unique', 'unique(vin)', 'VIN must be unique.'),
    ]

    @api.depends('trip_ids')
    def _compute_trip_count(self):
        for record in self:
            record.trip_count = len(record.trip_ids)

    @api.depends('maintenance_ids.cost')
    def _compute_maintenance_cost_total(self):
        for record in self:
            record.maintenance_cost_total = sum(record.maintenance_ids.mapped('cost'))

    @api.depends('expense_ids.fuel_cost')
    def _compute_total_fuel_cost(self):
        for record in self:
            record.total_fuel_cost = sum(record.expense_ids.mapped('fuel_cost'))

    @api.depends('maintenance_ids.cost')
    def _compute_total_maintenance_cost(self):
        for record in self:
            record.total_maintenance_cost = sum(record.maintenance_ids.mapped('cost'))

    @api.depends('total_fuel_cost', 'total_maintenance_cost')
    def _compute_total_operational_cost(self):
        for record in self:
            record.total_operational_cost = record.total_fuel_cost + record.total_maintenance_cost

    @api.depends('trip_ids.revenue', 'trip_ids.state')
    def _compute_total_revenue(self):
        for record in self:
            completed_trips = record.trip_ids.filtered(lambda trip: trip.state == 'completed')
            record.total_revenue = sum(completed_trips.mapped('revenue'))

    @api.depends('expense_ids.liters')
    def _compute_total_liters(self):
        for record in self:
            record.total_liters = sum(record.expense_ids.mapped('liters'))

    @api.depends('trip_ids.start_odometer', 'trip_ids.end_odometer', 'trip_ids.state', 'total_liters')
    def _compute_fuel_efficiency(self):
        for record in self:
            completed_trips = record.trip_ids.filtered(lambda t: t.state == 'completed')
            total_distance = sum((t.end_odometer or 0.0) - (t.start_odometer or 0.0) for t in completed_trips)
            if record.total_liters > 0:
                record.fuel_efficiency = total_distance / record.total_liters
            else:
                record.fuel_efficiency = 0.0

    @api.depends('total_revenue', 'total_operational_cost', 'acquisition_cost')
    def _compute_roi(self):
        for record in self:
            if record.acquisition_cost:
                record.roi = (record.total_revenue - record.total_operational_cost) / record.acquisition_cost
            else:
                record.roi = 0.0

    @api.constrains('capacity', 'odometer')
    def _check_positive_numbers(self):
        for record in self:
            if record.capacity and record.capacity < 0:
                raise ValidationError('Capacity cannot be negative.')
            if record.odometer and record.odometer < 0:
                raise ValidationError('Odometer cannot be negative.')

    # ── Retire / Reactivate lifecycle buttons ─────────────────────────

    def action_retire(self):
        """
        Mark the vehicle as Retired.
        - Prevents dispatch: trip creation form filters out retired vehicles.
        - If the vehicle is currently on a trip, raise an error — operator
          must complete or cancel the trip first.
        """
        self.ensure_one()
        if self.status == 'on_trip':
            raise ValidationError(
                "Vehicle '%s' is currently on a trip. "
                "Complete or cancel the trip before retiring." % self.name
            )
        self.write({'status': 'retired', 'active': False})
        return True

    def action_set_available(self):
        """
        Reactivate a retired vehicle, restoring it to Available status.
        Accessible from the form view via the 'Reactivate' button
        (visible only when status = retired).
        """
        self.ensure_one()
        self.write({'status': 'available', 'active': True})
        return True
