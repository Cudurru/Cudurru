"""
    Prelude Custom Exceptions
"""
import logging

ERROR_DICT = {
    # Validation Errors
    'required_field':               ('400', '1010'),
    'minimum_length':               ('400', '1020'),
    'maximum_length':               ('400', '1030'),
    'invalid_email':                ('400', '1040'),
    'field_not_matching':           ('400', '1050'),

    # Registration Errors
    'user_not_found':               ('400', '2010'),
    'user_already_exists':          ('400', '2015'),
    'multiple_users':               ('400', '2020'),
    'email_not_found':              ('400', '2030'),
    'invalid_password':             ('400', '2040'),
    'invalid_registration_code':    ('400', '2050'),
    'registration_not_found':       ('400', '2060'),
    'file_not_found':               ('404', '2070'),
    'code_not_found':               ('400', '2080'),

    # Server Errors
    'error_not_found':              ('500', '3020'),
    'server_issue':                 ('500', '3030'),
    'email_server_down':            ('500', '3040'),
    'invalid_validation':           ('500', '3050'),

    # JWT Errors
    'jwt_missing':                  ('400', '4010'),
    'jwt_expired':                  ('401', '4020'),
    'jwt_decode_error':             ('400', '4030'),
    'jwt_invalid':                  ('401', '4040'),
    'jwt_invalid_user':             ('401', '4050'),

    'header_missing':               ('400', '4015'),

    # Other
    'permission_not_found':         ('400', '4060'),
    'unknown_error':                ('500', '5003'),
    'no_access_rights':             ('403', '4033'),
    # Internal
    'no_session_passed':            ('500', '5001'),
    'local_upload_failed':          ('400', '4061'),

    # Data consistency errors
    'no_item_by_id':                ('404', '4404')

}


class PreludeError(Exception):
    """
        Unique error that contains http response information
    """
    def __init__(self, error_name, http_status_code=None, details=None, **kwargs):
        if error_name == '':
            error_name = 'unknown_error'
        self.error_name = error_name
        self.http_status_code, self.error_code = ERROR_DICT[error_name]
        if http_status_code is not None:
            self.http_status_code = http_status_code
        self.details = details
        super(PreludeError, self).__init__(error_name, **kwargs)

    def format_response(self, response):
        """
            This saves repeating a whole bunch of code
        """
        logging.error(self)
        response.status = self.http_status_code
        response_dict = {
            "success": 0,
            "code": self.error_code,
            "title": self.error_name,
            "details": self.details
            }
        return response_dict
