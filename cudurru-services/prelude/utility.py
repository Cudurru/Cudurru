""" utility """
import re
import time
import datetime
#from importlib import import_module
#import logging
import secrets
import smtplib
import bcrypt
import cherrypy
from cherrypy import _json as json
import jwt
from prelude.db import session
from prelude.errors import PreludeError
from prelude.local_settings import (JWT_PRIVATE_KEY,
                                    BCRYPT_LEVEL)
import prelude.models
from prelude.models import User


def hash_password(password):
    """ hash password """
    return bcrypt.hashpw(str(password).encode('utf8'), bcrypt.gensalt(BCRYPT_LEVEL)).decode('utf8')  # pylint: disable=no-member


def generate_jwt(user_id):
    """generate_jwt"""
    encoded_jwt = jwt.encode(
        {'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
         'id': user_id},
        JWT_PRIVATE_KEY,
        algorithm='HS256')
    return encoded_jwt.decode('utf-8')

def is_min_length(option_value, input_value):
    """
        Syntactic sugar
    """
    return len(input_value) >= int(option_value)

def is_within_max_length(option_value, input_value):
    """
        Syntactic sugar
    """
    return len(input_value) <= int(option_value)

def is_valid_email(input_value):
    """
        Syntactic sugar
    """
    email_regex = r"[^@]+@[^@]+\.[^@]+"
    return re.match(email_regex, input_value)


def validate_fields(input_fields=None, config_fields=None):
    """
        generic field validator
        validate fields given a dict
    """
    # @Robustness: Could move regex into a regex file at somepoint
    valid_option_names = ['required', 'minimum_length',
                          'maximum_length', 'type']

    # Create a new clean object to export
    clean_fields = {}
    cherrypy.log("Input fields: \n%s ", str(input_fields.keys()))
    for field_name, options in config_fields.items():
        # If field name is not in input_fields and it is not
        # required there is no validation to be done
        cherrypy.log("%s before existence check", field_name)
        if field_name not in input_fields and not options.get('required', False):
            continue
        cherrypy.log("%s after existence check", field_name)
        input_value = input_fields[field_name]
        for option_name, option_value in options.items():
            # Robustness against invalid validation options
            # this doesn't need to fail, just not attempt that validation
            # and possibly log it
            if option_name not in valid_option_names:
                continue
            if (option_name == 'required' and
                    option_value and
                    input_value == ""):
                details = "%s is missing" % field_name
                raise PreludeError('required_field', details=details)
            if (option_name == 'minimum_length' and
                    not is_min_length(option_value, input_value)):
                details = "%s is less than %d characters" % (
                    field_name, option_value)
                raise PreludeError('minimum_length', details=details)
            if (option_name == 'maximum_length' and
                    not is_within_max_length(option_value, input_value)):
                details = "%s is more than %d characters" % (
                    field_name, options['maximum_length'])
                raise PreludeError('maximum_length', details=details)
            if (option_name == 'type' and
                    option_value == "email" and
                    not is_valid_email(input_value)):
                details = "%s is invalid" % field_name
                raise PreludeError('invalid_email', details=details)
        clean_fields[field_name] = input_fields[field_name]
    return clean_fields



def generate_code():
    """random_urlsafe_code"""
    return secrets.token_urlsafe(24)


def send_email_advanced(from_email=None, to_email=None, content=None, cxn_args=None):
    """
        The advanced version allows customizing the header of each file
    """
    try:
        # We should probably extract only the needed properties before this..
        server = smtplib.SMTP(cxn_args['host'], cxn_args['port'])
        if cxn_args.get('username', False) and cxn_args.get('password', False):
            server.starttls()
            server.login(cxn_args['username'], cxn_args['password'])
        server.sendmail(from_email, to_email, content)
        server.quit()
    except ConnectionRefusedError:
        details = "Email server isn't running"
        raise PreludeError('email_server_down', details=details)


def send_email(to_email, subject, body, config):
    """ send registration email"""
    from_email = config['email']['from_email']
    content = "Subject: %s\nFrom: %s\nTo: %s\n\n%s" % (
        subject, from_email, to_email, body)
    # We should probably extract only the needed properties before this..
    method = config['email']['method']
    cxn_args = {}
    cxn_args['host'] = config[method]['host']
    cxn_args['port'] = config[method]['port']
    cxn_args['username'] = config[method]['username']
    cxn_args['password'] = config[method]['password']
    send_email_advanced(from_email, to_email, content, cxn_args)


def set_cors_header():
    """
        temporary cors fix
    """
    cherrypy.response.headers['Access-Control-Allow-Origin'] = '*'
    cherrypy.response.headers['Access-Control-Allow-Headers'] = 'Content-type'


def get_datetime_for_db():
    """ Syntactic sugar for repeated behavior """
    time.strftime('%Y-%m-%d %H:%M:%S')

#def require_permission(permission_const=None):
def require_permission():
    """
        Decorator for protected endpoints
        registered in main with
        cherrypy.tools.require_permission = cherrypy.Tool('before_handler', require_permission)
    """
    def _get_user_id_from_token(header_authorization):
        if header_authorization is None:
            details = "No Authorization header present"
            raise PreludeError('header_missing', details=details)
        auth_array = header_authorization.split(' ')
        if (len(auth_array) == 2 and auth_array[0] == 'Bearer:'):
            jwt_token = auth_array[1]
        else:
            details = "no jwt"
            raise PreludeError('jwt_missing', details=details)
        try:
            decoded = jwt.decode(
                jwt_token, JWT_PRIVATE_KEY, algorithms='HS256')
        except jwt.exceptions.ExpiredSignatureError:
            details = "expired jwt"
            raise PreludeError('jwt_expired', details=details)
        except jwt.exceptions.DecodeError:
            details = "incorrect jwt"
            raise PreludeError('jwt_decode_error', details=details)
        if "id" not in decoded:
            details = "id not in jwt token"
            raise PreludeError('jwt_invalid', details=details)
        user_id = decoded["id"]
        # Adding the "Bearer: " leader as noise, because it is expected
        cherrypy.response.headers['x-jwt'] = "Bearer: " + generate_jwt(user_id)

        return decoded["id"]

    def _get_user_from_token(header_authorization):
        user_id = _get_user_id_from_token(header_authorization)
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            details = "us"
            raise PreludeError('jwt_invalid_user', details=details)
        return user

    def _verify_user_permission(user, permission_const):
        for role in user.roles:
            for permission in role.permissions:
                if permission.permission_id == permission_const:
                    return True

        details = "Permission not found: %s" % permission_const.name
        raise PreludeError('permission_not_found', details=details)

    def do_auth():
        try:
            header = cherrypy.request.headers.get('Authorization')
            cherrypy.log(str(header))
            if header is None:
                cherrypy.log("header is none")
                details = "No Authorization header present"
                raise PreludeError('header_missing', details=details)
            user = _get_user_from_token(header)
            req = cherrypy.request
            req.authed_user = user.id
            #_verify_user_permission(user, permission_const)
        except PreludeError as exc:
            cherrypy.request.exc = exc
            raise exc

    return do_auth()

def _error_page():
    cherrypy.serving.response.headers['Content-Type'] = "application/json"
    error_details = cherrypy.request.exc.format_response(cherrypy.response)
    return  json.encode(error_details)

def error_page_401(status, message, traceback, version):#pylint: disable=unused-argument
    """
        Wrappers to allow CP to use our own custom error handlers even from decorators
    """
    cherrypy.log("custom 401")
    return _error_page()

def error_page_404(status, message, traceback, version):#pylint: disable=unused-argument
    """
        Wrappers to allow CP to use our own custom error handlers even from decorators
    """
    cherrypy.log("custom 404")
    return _error_page()

def error_page_500(status, message, traceback, version):#pylint: disable=unused-argument
    """
        Wrappers to allow CP to use our own custom error handlers even from decorators
    """
    cherrypy.log("custom 500")
    return _error_page()


def check_record_for_existence(model_name=None, input_location=None):
    """
        decorator for verifying a record exists before going on
        should later be able to add addt'l permissions checks either here or in similar place
        cherrypy.tools.require_permission = cherrypy.Tool('before_handler',
            check_record_for_existence)
        input_location
    """

    def checker():
        try:
            path_info = cherrypy.request.path_info
            #cherrypy.log(path_info)
            parts = path_info.split('/')
            #cherrypy.log(JSON.dumps(parts))
            # 2 is the number of places before the first location
            # of course, we count from 0 so we get 1
            # there's got to be a way to get at the names the method sees
            record_id = parts[input_location]
            if record_id is None:
                #ToDo-We need to find or create a proper error code
                raise PreludeError('', details="No Record Id Provided")
            model_ = getattr(prelude.models, model_name)

            record = session.query(model_).filter_by(uuid=record_id).first()

            if record is None:
                raise PreludeError('no_item_by_id', details="No matching Record found")
            cherrypy.request.identified_record = record
        except PreludeError as exc:
            cherrypy.request.exc = exc
            raise exc
    return checker()

def check_access_rights():
    """
        checks if user matches record user. Should be applied after both
        require_permission and verify_record.
    """
    def checker():
        try:
            user = cherrypy.request.authed_user
            record_user = cherrypy.request.identified_record.user_id
            cherrypy.log("user:{} | record_user:{}".format(user, record_user))
            if user != record_user:
                details = "User does not have access rights"
                raise PreludeError('no_access_rights', details=details)
        except PreludeError as exc:
            cherrypy.request.exc = exc
            raise exx

    return checker()
