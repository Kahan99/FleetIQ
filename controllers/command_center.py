import json
import logging

from odoo import http
from odoo.http import request
from odoo.exceptions import AccessError

_logger = logging.getLogger(__name__)


class CommandCenterController(http.Controller):
    """
    Provides a single authenticated JSON endpoint that the QWeb
    client action calls via fetch() to refresh KPI data.

    Auth: 'user'  → standard Odoo session cookie – RBAC is enforced
    by ir.model.access rules on FleetIQ.vehicle / FleetIQ.trip.
    """

    @http.route(
        '/fleetflow/command_center/data',
        type='json',
        auth='user',
        methods=['POST'],
        csrf=True,
    )
    def get_command_center_data(self, vehicle_type=None, vehicle_status=None, **_kw):
        """
        Return live KPI JSON for the Command Center dashboard.

        Called by the QWeb client action template via fetch().
        Only Fleet Managers and Dispatchers have the ir.model.access
        rights to read fleetflow.vehicle, so an AccessError is raised
        automatically for other roles.
        """
        try:
            data = request.env['fleetflow.vehicle'].get_command_center_data(
                vehicle_type=vehicle_type or None,
                vehicle_status=vehicle_status or None,
            )
            return data
        except AccessError as exc:
            _logger.warning('Command Center access denied: %s', exc)
            return {'error': 'access_denied', 'message': str(exc)}
        except Exception as exc:
            _logger.exception('Command Center data fetch failed')
            return {'error': 'server_error', 'message': str(exc)}
