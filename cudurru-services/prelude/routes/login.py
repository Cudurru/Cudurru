# pylint:disable=invalid-name, no-self-use, too-few-public-methods
# pylint:disable=fixme
""" Login """
#import logging
import cherrypy
from prelude.config import Config
from prelude.db import session
from prelude.errors import PreludeError
from prelude.local_settings import (CONFIG_FILE_NAME)
import prelude.requests.login_request as LoginRequest
from prelude.utility import validate_fields, generate_jwt


@cherrypy.expose
@cherrypy.tools.cors() #pylint: disable=no-member # member is registered in base
class Login():
    """
        Endpoint: /login
        Summary: Basic login that return JWT
        Description: See Post
    """

    def OPTIONS(self):
        """
            Necessary for CORS
        """

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self):
        """
            Name: Login User
            Summary: basic user ID and password login
            Description: takes email and password, return success and x-jwt header
                and jwt in args for verbosity
        """
        json_dict = {"success": 1}
        try:
            input_json = cherrypy.request.json
            configs = Config(CONFIG_FILE_NAME)
            validate_fields(
                input_fields=input_json,
                config_fields=configs['Login']['fields']
            )

            # setup fields
            username = input_json['email']
            password = input_json['password']

            # validate username/password
            user = LoginRequest.get_valid_user(username, password, session)

            #generate_jwt
            jwt = generate_jwt(user.id)
            #Adding "Bearer: " leader noise, because it is expected
            cherrypy.response.headers['x-jwt'] = "Bearer: " + jwt

            cherrypy.response.status = 200
            json_dict["jwt"] = jwt
        except PreludeError as exc:
            return exc.format_response(cherrypy.response)
        return json_dict
