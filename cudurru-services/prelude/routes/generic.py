""" Generic """
import cherrypy

@cherrypy.expose
class Generic():
    """Generic"""
    def __init__(self, controller_name=None, action_name=None, **kwargs): # pylint: disable=unused-argument
        """__init__

        :param controller_name:
        :param action_name:
        :param **kwargs:
        """
        self.controller_name = controller_name
        self.action_name = action_name
        cherrypy.log("init")
        cherrypy.log(self.action_name)

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def GET(self, *args, **kwargs):  # pylint: disable=no-self-use,invalid-name,unused-argument
        """GET

        :param *args:
        :param **kwargs:
        """
        cherrypy.log("get")
        cherrypy.log(self.action_name)
        cherrypy.log(repr(*args))
        return "get %s/%s" % (self.controller_name, self.action_name)

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self, *args, **kwargs):  # pylint: disable=no-self-use,invalid-name,unused-argument
        """POST

        :param *args:
        :param **kwargs:
        """
        return "post %s/%s" % (self.controller_name, self.action_name)

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def PATCH(self, *args, **kwargs):  # pylint: disable=no-self-use,invalid-name,unused-argument
        """PATCH

        :param *args:
        :param **kwargs:
        """
        return "patch %s/%s" % (self.controller_name, self.action_name)
