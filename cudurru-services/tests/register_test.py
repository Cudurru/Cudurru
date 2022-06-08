""" testing """
import prelude.requests.register_request as RegisterRequest
from prelude.utility import validate_fields
from prelude.errors import PreludeError

import pytest
import cherrypy
from prelude_test import PreludeTest
from prelude.base import Routing


class Register(PreludeTest):
    """ Testing for register """
    @staticmethod
    def setup_server():
        """ setup with method dispatcher """
        conf = {
            "email": {
                "from_email": "seth@doercreator.com",
                "method": "method1"
            },
            "method1": {
                "host": "localhost",
                "port": 1025,
                "username": "",
                "password": "",
            },
            '/': {
                'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
                'tools.sessions.on': False,
                'tools.response_headers.on': True,
                'tools.response_headers.headers':
                    [('Content-Type', 'text/plain')],
            }
        }
        cherrypy.tree.mount(Routing(), '/', conf)

    def test_register_passes(self):
        """ /register """
        body = {"username": "nkkjone",
                "password": "testtest",
                "email": "seth@validemail.com"}
        self.post_json("/register", body=body)
        self.assertStatus('201 Created')

    def test_register_required_field_error(self):
        """test_register_required_field_error"""
        body = {"username": "nkkjone",
                "email": "seth@validemail.com"}
        self.post_json("/register", body=body)
        assert self.body_json['title'] == "required_field"
        self.assertStatus('400 Bad Request')

    def test_register_minimum_length_error(self):
        """test_register_minimum_length_error"""
        body = {"username": "nk",
                "password": "testtest",
                "email": "seth@validemail.com"}
        self.post_json("/register", body=body)
        assert self.body_json['title'] == "minimum_length"
        self.assertStatus('400 Bad Request')

    def test_register_maximum_length_error(self):
        """test_register_maximum_length_error"""
        body = {"username": "fdsafkljdsaklfjsdakljfdsaklfjadsklfas",
                "email": "seth@validemail.com"}
        self.post_json("/register", body=body)
        assert self.body_json['title'] == "maximum_length"
        self.assertStatus('400 Bad Request')

    def test_register_patch_no_code(self):
        """ /register """
        body = {}
        self.patch_json("/register", body=body)
        self.assertHeader('Content-Type', 'application/json')
        assert self.body_json['title'] == "required_field"
        self.assertStatus('400 Bad Request')

    def test_register_patch_invalid_code(self):
        """ /register """
        body = {"code": "invalid_code"}
        self.patch_json("/register", body=body)
        self.assertHeader('Content-Type', 'application/json')
        assert self.body_json['title'] == "code_not_found"
        self.assertStatus('400 Bad Request')

    def test_register_patch(self):
        """ /register """
        self.skip()
        body = {"code": "QLajN9s5p4gESQGXttBhw-MFMiQvdQfB"}
        self.patch_json("/register", body=body)
        self.assertHeader('Content-Type', 'application/json')
        self.assertStatus('204 No Content')
