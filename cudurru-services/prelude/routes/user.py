# pylint:disable=fixme
"""
    User Just a get method, for returning User data.
"""
import cherrypy
from prelude.config import Config
from prelude.db import session
from prelude.errors import PreludeError
from prelude.local_settings import (CONFIG_FILE_NAME)
from prelude.requests.user import UserRequestHandler

@cherrypy.expose
class User():
    """
        Summary: Endpoint for dealing with user Data.
        Description: For now just a simple GET method.
    """
    @cherrypy.tools.json_out()
    @cherrypy.tools.require_permission()
    def GET(self):
        """
            summary: return authed_user's info.
            description: returns authed_user info, with a list of properties
                ids that user has on the database.
        """
        json_dict = {"success": 1}
        try:
            input_json = {}
            configs = Config(CONFIG_FILE_NAME)
            input_json['user_id'] = cherrypy.request.authed_user
            urh = UserRequestHandler(
                session=session,
                req_args=input_json,
                configs=configs
            )
            json_dict['userData'] = urh.retrieve_user_info()
            cherrypy.response.status = 200
        except Exception as exc:
            cherrypy.response.status = 400
            json_dict['success'] = 0
            cherrypy.log(str(exc))
        return json_dict
