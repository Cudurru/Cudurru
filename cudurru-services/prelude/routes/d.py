""" Placeholder RESTful handler for echo confirmation of running service
"""

import logging
import cherrypy

@cherrypy.expose
class DThing():
    """ /d """
    @cherrypy.tools.accept(media='text/plain')
    @cherrypy.tools.json_out()
    def GET(self):  # pylint: disable=invalid-name, no-self-use
        """ Testing endpoint"""
        cherrypy.log("Dthing is ")
        return {"success": 1, "details": "get on dthing"}

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self):  # pylint: disable=invalid-name, no-self-use
        """ Functions as an echo test on POST """
        cherrypy.log("POST on DThing")
        cherrypy.response.status = 201
        return {"success": 1, "details": "post on dthing"}


