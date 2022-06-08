# pylint:disable=invalid-name, no-self-use, too-few-public-methods
# pylint:disable=fixme
"""
    Register endpoints
"""
import logging
import cherrypy
from sqlalchemy.exc import IntegrityError
from prelude.config import Config
from prelude.db import session
from prelude.errors import PreludeError
from prelude.local_settings import (CONFIG_FILE_NAME)
from prelude.requests.register_request import RegistrationHandler
from prelude.utility import validate_fields


@cherrypy.expose
@cherrypy.tools.cors()
class Register():
    """
        Endpoint: /register
        Summary: Registration of new users
        Description: Restful route for handling registration requests
    """

    def OPTIONS(self):
        """
            Necessary for CORS
        """

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self):
        """
            Name: Register/Signup
            Summary: Register a new user
            Description: Registers a new user with email
        """
        json_dict = {"success": 1}
        try:
            # This is needed, otherwise server can get stuck in a permanent fail mode
            session.rollback()
            # Do Validation
            input_json = cherrypy.request.json
            configs = Config(CONFIG_FILE_NAME)
            validate_fields(
                input_fields=input_json,
                config_fields=configs['User']['fields'])

            rrh = RegistrationHandler(session=session, req_args=input_json)
            # ToDo: Registrations model has headers limited to 255, will fix later
            #rrh.log_registration(cherrypy.request.headers)
            #ToDo: check for user w/ this username/email before creation
            rrh.check_for_user()
            rrh.create_user(auto_enable=True)
            #rrh.create_registration_code()
            #ToDo: async emails
            #rrh.send_registration_email()

            session.commit()

            cherrypy.response.status = 201
        # This catches multiple users if we miss it on our own
        except IntegrityError as exc:
            session.rollback()
            logging.error(exc)
            cherrypy.response.status = 400
            return {
                "success": 0,
                "code": "user_already_exists"
                }
        except PreludeError as exc:
            session.rollback()
            return exc.format_response(cherrypy.response)
        return json_dict

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def PATCH(self):
        """Enable User"""
        try:
            req_json = cherrypy.request.json
            validate_fields(
                input_fields=req_json,
                config_fields={"code": {"required": True}})

            rrh = RegistrationHandler(session=session, req_args=req_json)
            rrh.verify_registration_code()
            rrh.enable_user()
            session.commit()

            cherrypy.response.status = 204
            return {'success': 1}
        except PreludeError as exc:
            session.rollback()
            return exc.format_response(cherrypy.response)

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def DELETE(self):
        """ delete (disable) a user account """
        try:
            valid_fields = validate_fields(
                input_fields=cherrypy.request.json,
                config_fields={"code": {"required": True}})

            code = valid_fields["code"]

            rrh = RegistrationHandler(session=session)
            rrh.deactivate_registration(code)

            cherrypy.response.status = 204
            return {'success': 1}
        except PreludeError as exc:
            session.rollback()
            return exc.format_response(cherrypy.response)
