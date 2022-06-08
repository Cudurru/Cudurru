""" LoginTest """
import cherrypy
import pytest
from prelude_test import PreludeTest
from prelude.base import Routing
import prelude.requests.login_request as LoginRequest
from prelude.errors import PreludeError


class LoginTest(PreludeTest):
    """ LoginTest """

    @staticmethod
    def setup_server():
        """ setup with method dispatcher """
        conf = {
            '/': {
                'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
                'tools.sessions.on': False,
                'tools.response_headers.on': True,
                'tools.response_headers.headers':
                    [('Content-Type', 'text/plain')],
            }
        }
        cherrypy.tree.mount(Routing(), '/', conf)

    def test_login(self):
        """ /login """
        self.skip()
        # how to do this without mocking
        self.post_json("/login", body={"username": "test", "password": "test"})
        self.assertStatus('200 OK')

    def test_login_fails_required(self):
        """ /login """
        self.post_json("/login", body={})
        self.assertStatus('400 Bad Request')
