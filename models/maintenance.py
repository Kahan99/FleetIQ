from odoo import api, fields, models
from odoo.exceptions import ValidationError


class FleetIQMaintenance(models.Model):
    _name = 'FleetIQ.maintenance'
    _description = 'Fleet Maintenance'

    vehicle_id = fields.Many2one('FleetIQ.vehicle', required=True, ondelete='cascade')
    company_id = fields.Many2one(related='vehicle_id.company_id', store=True, readonly=True)
    vehicle_status = fields.Selection(related='vehicle_id.status', store=True, readonly=True)
    issue = fields.Char(required=True)
    cost = fields.Float(default=0.0)
    service_date = fields.Date(required=True, default=fields.Date.context_today)

    @api.constrains('cost')
    def _check_cost(self):
        for record in self:
            if record.cost < 0:
                raise ValidationError('Maintenance cost cannot be negative.')

    @api.model_create_multi
    def create(self, vals_list):
        records = super().create(vals_list)
        records.mapped('vehicle_id').write({'status': 'in_shop'})
        return records
