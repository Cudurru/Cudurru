""" Our testing interface for all RESTFUL calls to database"""
import cherrypy

@cherrypy.expose
class DatabaseTest():
    """ Endpoints to show database connection works """
    @cherrypy.tools.json_out()
    def GET(self): #pylint: disable=invalid-name, no-self-use
        """ Return a basic string for GET Calls """
        # value = session.query(Messages).first()
        # cherrypy.log("%s" % value)
        # cherrypy.log("%s" % value.value)
        return {'success': 1}

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def POST(self): #pylint: disable=invalid-name, no-self-use
        """ Functions as an echo test on POST """
        cherrypy.log("POST on DB Test")
        input_json = cherrypy.request.json
        cherrypy.log("%s" % input_json)
        cherrypy.log("%s" % input_json['memberId'])
        # msg = Messages()
        # msg.id = 2
        # msg.value = input_json['memberId']
        # session.add(msg)
        # session.commit()
        cherrypy.response.status = 201
        return input_json

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def PATCH(self): #pylint: disable=invalid-name, no-self-use
        """ Functions as an echo test on POST """
        cherrypy.log("PATCH on DB Test")
        cherrypy.response.status = 204
        input_json = cherrypy.request.json
        return input_json

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def PUT(self, record=None): #pylint: disable=invalid-name, no-self-use
        """ Functions as an echo test on POST """
        cherrypy.log("Record is %s " % record)
        cherrypy.log("PUT on DB Test")
        input_json = cherrypy.request.json
        # value = session.query(Messages).filter_by(
        #    id=record).first()
        # cherrypy.log("%s" % value)
        # cherrypy.log("%s" % value.value)
        # value.value = input_json['memberId']
        # session.add(value)
        # session.commit()
        cherrypy.response.status = 204
        return input_json
