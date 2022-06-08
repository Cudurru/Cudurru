""" Register Request"""
import cherrypy
#import logging
from mako.template import Template
import sqlalchemy as sa

from prelude.models import User, Registration, RegistrationCode
from prelude.utility import generate_code, hash_password, send_email
from prelude.errors import PreludeError

REGISTRATION_EMAIL_SUBJECT = "Welcome aboard."

class RegistrationHandler():
    """
        Manages ORM style requests for databases access related to registration
    """

    def __init__(self, session=None, req_args=None):
        if session is None:
            details = "No session passed"
            raise PreludeError('no_session_passed', details=details)
        self.session = session
        self.args = req_args
        self.register_code = ''

    def create_user(self, auto_enable=False):
        """ Create New User """
        user = User()
        user.email = self.args.get('email')
        user.username = self.args.get('username')
        user.password = hash_password(self.args.get('password'))
        if auto_enable:
            user.active_status = True
        self.session.add(user)

    def log_registration(self, headers):
        """ Create New Registration """
        # generate code won't fail
        self.register_code = generate_code()

        registration = Registration()
        registration.email = self.args.get('email')
        registration.username = self.args.get('username')
        registration.headers = str(headers)
        self.session.add(registration)

    def check_for_user(self):
        """
            Queries user table to check for existing user, throws error if found
        """
        email = self.args.get('email')
        users = self.session.query(User).filter_by(
            email=email).count()
        if users > 0:
            details = "We already have a user with this name"
            raise PreludeError('user_already_exists', details=details)

    def create_registration_code(self):
        """ Create New Registration """
        email = self.args.get('email')
        old_codes = self.session.query(RegistrationCode).filter_by(
            email=email).all()
        for _reg_code in old_codes:
            _reg_code.deactivated_date = sa.func.now()
            self.session.add(_reg_code)

        reg_code = RegistrationCode()
        reg_code.email = email
        reg_code.username = self.args.get('username')
        reg_code.code = self.register_code
        self.session.add(reg_code)

    def verify_registration_code(self):
        """
            verify registration code is correct and active
        """
        code = self.args.get('code')
        registration = self.session.query(RegistrationCode).filter_by(
            deactivated_date=None, code=code).all()
        if len(registration) == 0:
            details = "couldn't find that code in database"
            raise PreludeError('code_not_found', details=details)
        if len(registration) != 1:
            details = "multiple codes found in database"
            raise PreludeError('multiple_codes', details=details)

    def enable_user(self):
        """
            activate user and deactive registration code
        """
        user = self.session.query(User).filter_by(
            username=registration.username).first()
        user.activated_date = sa.func.now()
        user.active_status = True
        self.session.add(user)

    def deactive_reg_code(self):
        code = self.args.get('code')
        registration = self.session.query(RegistrationCode).filter_by(
            deactivated_date=None, code=code).first()
        registration.deactivated_date = sa.func.now()
        self.session.add(registration)

    def send_registration_email(self):
        """
            Send registration email
        """
        email_config = cherrypy.request.app.config
        email = self.args.get('email')
        # Will give FileNotFoundError if template not found
        #from_email = email_config['email']['from_email']
        #to_email = "add this when adapting register request"
        register_url = "%s/register/%s" % (cherrypy.request.base, self.register_code)
        email_template = Template(
            filename="./prelude/views/registration_email.html").render(register_url=register_url)
        send_email(email, REGISTRATION_EMAIL_SUBJECT,
                   email_template, email_config)
