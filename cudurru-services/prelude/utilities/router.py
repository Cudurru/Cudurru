""" syntactic sugar for creating new routes in cherrypy
"""
from importlib import import_module
#import logging
import cherrypy


@cherrypy.expose #pylint:disable=too-few-public-methods
class Root(object):
    """ Standard branch root w/ testable points """
    def GET(self): #pylint:disable=invalid-name, no-self-use
        """ Place holder to prove something is working """
        return "Hello, world!"

class Route(object): #pylint:disable=too-few-public-methods
    """ syntactic sugar for creating new routes in cherrypy
    """

    def __init__(self, path=None, controller=None):
        self.path = path
        self.controller = controller


class Tree(object): #pylint:disable=too-few-public-methods
    """ creates a route tree from an array of Route
    """
    def __init__(self, routes=None):
        cherrypy.log("tree init")
        for route in routes:
            module_parts = route.controller.split('.')
            cherrypy.log(module_parts[0])
            class_name = module_parts.pop()
            inner = '.'
            module_name = inner.join(module_parts)
            module = import_module(module_name)
            class_ = getattr(module, class_name)
            instance = class_()
            #setattr(self.root, route.path, instance)
            setattr(self, route.path, instance)
