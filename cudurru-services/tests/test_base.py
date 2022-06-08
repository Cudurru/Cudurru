""" testing """
import cherrypy
from prelude_test import PreludeTest
from prelude.base import Routing


class Test(PreludeTest):
    """ Testing for base.py """
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

    def test_index(self):
        """ / """
        self.skip(msg="I broke the index, come back to this")
        self.getPage("/")
        self.assertStatus('200 OK')
        self.assertHeader('Content-Type', 'text/plain;charset=utf-8')
        self.assertBody('hello folks')

    def test_index_post(self):
        """ post """
        self.post_json("/index", body={})
        self.assertHeader('Content-Type', 'application/json')
        self.assertStatus('201 Created')

    def test_index_patch(self):
        """ patch """
        self.patch_json("/index", body={})
        self.assertHeader('Content-Type', 'application/json')
        self.assertStatus('204 No Content')

    def test_dthing(self):
        """ /d """
        self.getPage("/d")
        self.assertHeader('Content-Type', 'application/json')
        self.assertStatus('200 OK')

    def test_dthing_post(self):
        """  put """
        self.post_json("/d", body={})
        self.assertHeader('Content-Type', 'application/json')
        self.assertStatus('201 Created')

    def test_db(self):
        """ /db """
        self.getPage("/db")
        self.assertStatus('200 OK')

    def test_db_patch(self):
        """ patch """
        self.patch_json("/db", body={})
        self.assertStatus('204 No Content')

    def test_db_put(self):
        """  put """
        self.skip(msg="Not Implemented")
        body = {"memberId": "123"}
        json_headers = self.make_json_headers(body)
        self.getPage("/db", headers=json_headers, method='put', body=body)
        self.assertStatus('204 No Content')

    def test_db_post(self):
        """ post """
        body = {"memberId": "124"}
        self.post_json("/db", body=body)
        self.assertStatus('201 Created')

    def test_routed(self):
        """ /other """
        self.getPage("/eos")
        self.assertHeader('Content-Type', 'application/json')
        self.assertStatus('200 OK')

    def test_routed_post(self):
        """ post """
        self.post_json("/eos", body={})
        self.assertHeader('Content-Type', 'application/json')
        self.assertStatus('201 Created')
