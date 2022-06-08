""" Placeholder RESTful handler for admin functions
"""

import logging
import cherrypy

from prelude.const import Const

@cherrypy.expose
class Admin():
    """
        Admin placeholder
    """
    @cherrypy.tools.json_out()
    @cherrypy.tools.json_in()
    @cherrypy.tools.require_permission(permission_const=Const.ACCESS_FAKE_ADMIN_PAGE)
    def GET(self):  # pylint: disable=invalid-name, no-self-use
        return {"success": 1, "details": "admin success"}
