""" Test Helper """
import json
from cherrypy.test import helper


class PreludeTest(helper.CPWebCase):
    """ Extended Web"""

    @staticmethod
    def body_bytes_from_json(body_json):
        """ Generate bytes from python dict (like json) """
        return json.dumps(body_json).encode('utf-8')

    def make_json_headers(self, body_json):
        """ make json headers from python dict """
        body_bytes = self.body_bytes_from_json(body_json)
        return PreludeTest.make_json_headers_from_bytes(body_bytes)

    @staticmethod
    def make_json_headers_from_bytes(body):
        """ make json headers from raw bytes """
        json_headers = [
            ('Content-Type', 'application/json'),
            ('Content-Length', str(len(body)))
        ]
        return json_headers

    def post_json(self, *args, body=None, **kwargs):
        """ defaults to using json """
        body_bytes = self.body_bytes_from_json(body)
        json_headers = PreludeTest.make_json_headers_from_bytes(body_bytes)
        return self.post_custom(
            *args, body=body_bytes, headers=json_headers, **kwargs)

    def post_custom(self, *args, **kwargs):
        """ simply adds post method """
        return self.getPage(
            *args, method='post', **kwargs)

    def patch_json(self, *args, body=None, **kwargs):
        """ defaults to using json """
        body_bytes = self.body_bytes_from_json(body)
        json_headers = self.make_json_headers_from_bytes(body_bytes)
        return self.patch_custom(
            *args, body=body_bytes, headers=json_headers, **kwargs)

    def patch_custom(self, *args, **kwargs):
        """ simply adds patch method """
        return self.getPage(
            *args, method='patch', **kwargs)

    @property
    def body_json(self):
        return json.loads(self.body.decode('utf8'))
