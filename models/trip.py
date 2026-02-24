import base64
import csv
import io

from odoo import models, fields, api
from odoo.exceptions import ValidationError
from datetime import date


class FleetflowTrip(models.Model):
    _name = 'fleetflow.trip'
    _description = 'Fleet Trip'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'name desc'

    name = fields.Char(string='Trip Reference', required=True, copy=False, readonly=True, index=True, default=lambda self: 'New')
    vehicle_id = fields.Many2one('fleetflow.vehicle', string='Vehicle', required=True)
    driver_id = fields.Many2one('fleetflow.driver', string='Driver', required=True)
    cargo_weight = fields.Float(string='Cargo Weight (Tons)')
    origin = fields.Char(string='Origin', required=True)
    destination = fields.Char(string='Destination', required=True)
    revenue = fields.Float(string='Revenue')
    state = fields.Selection([
        ('draft', 'Draft'),
        ('dispatched', 'Dispatched'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], default='draft', string='Status', required=True)
    start_odometer = fields.Float(string='Start Odometer')
    end_odometer = fields.Float(string='End Odometer')
    company_id = fields.Many2one(related='vehicle_id.company_id', store=True, readonly=True)
    expense_ids = fields.One2many('fleetflow.expense', 'trip_id', string='Expenses')
    # Read-only helper: mirrors vehicle max_capacity so the trip form can display
    # a capacity warning without using invalid relational dot-path XML field refs.
    vehicle_max_capacity = fields.Float(
        string='Vehicle Max Capacity (Tons)',
        related='vehicle_id.max_capacity',
        readonly=True,
        store=False,
    )

    @api.constrains('cargo_weight', 'vehicle_id')
    def _check_vehicle_capacity(self):
        for record in self:
            if record.vehicle_id and record.cargo_weight > record.vehicle_id.max_capacity:
                raise ValidationError(f"Trip cargo weight ({record.cargo_weight} Tons) exceeds vehicle max capacity ({record.vehicle_id.max_capacity} Tons).")

    @api.constrains('driver_id')
    def _check_driver_license(self):
        for record in self:
            if record.driver_id and record.driver_id.license_expiry and record.driver_id.license_expiry < date.today():
                raise ValidationError(f"Driver {record.driver_id.name} has an expired license.")

    @api.constrains('driver_id', 'vehicle_id')
    def _check_driver_category(self):
        for record in self:
            if record.driver_id and record.vehicle_id:
                if record.driver_id.license_category != record.vehicle_id.vehicle_type:
                    raise ValidationError(
                        f"Driver {record.driver_id.name} is not licensed for {record.vehicle_id.vehicle_type} category. "
                        f"(Driver Category: {record.driver_id.license_category})"
                    )

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('name', 'New') == 'New':
                vals['name'] = self.env['ir.sequence'].next_by_code('fleetflow.trip') or 'New'
        return super().create(vals_list)

    def action_dispatch(self):
        self.ensure_one()
        if self.state != 'draft':
            raise ValidationError("Only draft trips can be dispatched.")
        
        # Auto-fill start odometer from vehicle if not provided
        if not self.start_odometer:
            self.start_odometer = self.vehicle_id.odometer

        self.write({'state': 'dispatched'})
        self.vehicle_id.write({'status': 'on_trip'})
        self.driver_id.write({'status': 'on_duty'})

    def action_complete(self):
        self.ensure_one()
        if self.state != 'dispatched':
            raise ValidationError("Only dispatched trips can be completed.")
        
        if not self.end_odometer:
            raise ValidationError("Please provide the final odometer reading before completing the trip.")
        
        if self.end_odometer < self.start_odometer:
            raise ValidationError(
                f"End odometer ({self.end_odometer}) cannot be less than start odometer ({self.start_odometer})."
            )

        self.write({'state': 'completed'})
        
        # Sync odometer back to vehicle
        self.vehicle_id.write({
            'status': 'available',
            'odometer': self.end_odometer
        })
        self.driver_id.write({'status': 'off_duty'})

    def action_cancel(self):
        self.ensure_one()
        self.write({'state': 'cancelled'})
        if self.vehicle_id.status == 'on_trip':
            self.vehicle_id.write({'status': 'available'})
        if self.driver_id.status == 'on_duty':
            self.driver_id.write({'status': 'off_duty'})

    def action_export_csv(self):
        trips = self if self else self.search([])

        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow([
            'Reference',
            'Vehicle',
            'Driver',
            'Origin',
            'Destination',
            'Status',
            'Start Odometer',
            'End Odometer',
            'Distance',
            'Revenue',
        ])

        for trip in trips:
            distance = (trip.end_odometer or 0.0) - (trip.start_odometer or 0.0)
            writer.writerow([
                trip.name or '',
                trip.vehicle_id.name or '',
                trip.driver_id.name or '',
                trip.origin or '',
                trip.destination or '',
                trip.state or '',
                trip.start_odometer or 0.0,
                trip.end_odometer or 0.0,
                distance,
                trip.revenue or 0.0,
            ])

        csv_content = buffer.getvalue().encode('utf-8')
        attachment = self.env['ir.attachment'].create({
            'name': 'fleetflow_trips_export.csv',
            'type': 'binary',
            'datas': base64.b64encode(csv_content),
            'mimetype': 'text/csv',
            'res_model': 'fleetflow.trip',
        })

        return {
            'type': 'ir.actions.act_url',
            'url': f'/web/content/{attachment.id}?download=true',
            'target': 'self',
        }
