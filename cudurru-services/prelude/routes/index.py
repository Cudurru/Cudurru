""" Index Route """
import cherrypy


@cherrypy.expose
class Index():
    """ our destination for '/' """
    @cherrypy.tools.accept(media='text/plain')
    @cherrypy.tools.json_out()
    def GET(self):  # pylint: disable=invalid-name, no-self-use
        """ Return a basic string for GET Calls """
        cherrypy.log("GET on index")
        return {"success": 1}

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self):  # pylint: disable=invalid-name, no-self-use
        """ Functions as an echo test on POST """
        cherrypy.log("POST on index")
        cherrypy.response.status = 201
        input_json = cherrypy.request.json
        return {"success": 0, "details": input_json}

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def PATCH(self):  # pylint: disable=invalid-name, no-self-use
        """ Functions as an echo test on POST """
        cherrypy.response.status = 204
        input_json = cherrypy.request.json
        return {"success": 0, "details": input_json}
