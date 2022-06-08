""" Reset Password """
import cherrypy
from prelude.db import session
import prelude.utility as Utility
import logging
import prelude.requests.reset_password_request as ResetPassword
from prelude.errors import PreludeError


@cherrypy.expose
class ResetPasswordRoute():
    """ Forgot password """

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def PATCH(self):
        """ Send email with special token """

        reset_code = Utility.generate_code()
        try:
            # Do Validation
            valid_fields = Utility.validate_fields(
                cherrypy.request.json, {"email": {"required": True}})

            # Setup Variables
            email = valid_fields['email']

            # Update Database
            ResetPassword.add_reset_code(reset_code, email, session)

            # Send Email
            ResetPassword.send_reset_code_email(reset_code, email)

            session.commit()

            return {"success": 1}
        except PreludeError as exc:
            session.rollback()
            logging.error(exc)
            cherrypy.response.status = exc.http_status_code
            return {"success": 0,
                    "code": exc.error_code, "title": exc.error_name, "details": exc.details}

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self):
        """  Reset Password """
        try:
            # Do Validation
            validation_options = {
                "reset_code": {"required": True},
                "password": {"required": True},
                "password_confirm": {"required": True, "match_other_field": "password"}
            }
            valid_fields = Utility.validate_fields(
                cherrypy.request.json, validation_options)

            reset_code = valid_fields['reset_code']
            password = valid_fields['password']

            # Update Database
            ResetPassword.set_password(reset_code, password, session)

            session.commit()

            return {"success": 1}
        except PreludeError as exc:
            session.rollback()
            logging.error(exc)
            cherrypy.response.status = exc.http_status_code
            return {"success": 0,
                    "code": exc.error_code, "title": exc.error_name, "details": exc.details}
