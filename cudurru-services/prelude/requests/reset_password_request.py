"""Reset Password Request"""
import cherrypy
import prelude.utility as Utility
import prelude.models as Model
from prelude.errors import PreludeError
from mako.template import Template

# @Todo: Create constants for everything and move to an imported file
RESET_EMAIL_SUBJECT = "Your Password has been Reset"


def add_reset_code(reset_code, email, session):
    """update_database"""
    user = session.query(Model.User).filter_by(
        email=email).order_by("id").first()
    if user is None:
        details = "user with email %s not found" % email
        raise PreludeError('email_not_found', details=details)
    user.reset_code = reset_code
    session.add(user)


def send_reset_code_email(reset_code, to_email):
    """send_email"""
    # Will give FileNotFoundError if template not found
    # @UsesGlobal: Has dependency upon cherrpy.request.app.config
    config = cherrypy.request.app.config
    reset_url = "%s/reset_password/%s" % (cherrypy.request.base, reset_code)
    email_template = Template(
        filename="./prelude/views/reset_code_email.html").render(reset_url=reset_url)
    Utility.send_email(to_email, RESET_EMAIL_SUBJECT, email_template, config)


def set_password(reset_code, password, session):
    """update_database"""
    user = session.query(Model.User).filter_by(
        reset_code=reset_code).order_by("id").first()
    if user is None:
        details = "User not found with reset code '%s'" % reset_code
        raise PreludeError('user_not_found', details=details)
    user.password = Utility.hash_password(password)
    user.reset_code = ""
    session.add(user)
