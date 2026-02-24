from datetime import date

from odoo import fields, models


class ReportFleetflowVehicleMonthlyCost(models.AbstractModel):
    _name = 'report.fleetflow.report_vehicle_monthly_cost_template'
    _description = 'fleetflow Monthly Vehicle Cost Report'

    def _get_report_values(self, docids, data=None):
        vehicles = self.env['fleetflow.vehicle'].browse(docids)
        today = fields.Date.today() or date.today()
        month_start = today.replace(day=1)

        docs = []
        for vehicle in vehicles:
            monthly_expenses = vehicle.expense_ids.filtered(
                lambda e: e.expense_date and month_start <= e.expense_date <= today
            )
            monthly_maintenance = vehicle.maintenance_ids.filtered(
                lambda m: m.service_date and month_start <= m.service_date <= today
            )
            fuel_cost = sum(monthly_expenses.mapped('fuel_cost'))
            maintenance_cost = sum(monthly_maintenance.mapped('cost'))
            total_cost = fuel_cost + maintenance_cost
            docs.append({
                'vehicle': vehicle,
                'fuel_cost': fuel_cost,
                'maintenance_cost': maintenance_cost,
                'total_cost': total_cost,
                'month_start': month_start,
                'today': today,
            })

        return {
            'doc_ids': docids,
            'doc_model': 'fleetflow.vehicle',
            'docs': docs,
            'month_start': month_start,
            'today': today,
        }
