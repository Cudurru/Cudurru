"""
   Property endpoints
"""
import cherrypy
from prelude.config import Config
from prelude.db import session
from prelude.errors import PreludeError
from prelude.local_settings import (CONFIG_FILE_NAME)
from prelude.requests.properties import PropertiesHandler
from prelude.utility import validate_fields

@cherrypy.expose
class Property():
    """
        Summary: None
        Description: None
    """

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    @cherrypy.tools.verify_rights()
    @cherrypy.tools.require_permission()
    @cherrypy.tools.verify_record(model_name='PropertyBase', input_location=2)
    def PUT(self, propertyId=None): #pylint: disable=invalid-name
        """
            summary: update a property object
            description : updates a property by id
        """
        json_dict = {"success":1}
        try:
            input_json = cherrypy.request.json
            configs = Config(CONFIG_FILE_NAME)
            validate_fields(
                input_fields=input_json,
                config_fields=configs['Properties']['put_fields']
                )
            input_json['property_id'] = propertyId
            pph = PropertiesHandler(
                session=session, req_args=input_json, configs=configs)
            pph.update_property()
            session.commit()
            cherrypy.response.status = 200
            json_dict['propertyId'] = propertyId
        except PreludeError as exc:
            session.rollback()
            return exc.format_response(cherrypy.response)
        except Exception as exc:
            session.rollback()
            cherrypy.log(str(exc))
            cherrypy.response.status = 400
            json_dict["success"] = 0
        return json_dict

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    @cherrypy.tools.verify_record(model_name='PropertyBase', input_location=2)
    def GET(self, propertyId=None): #pylint: disable=invalid-name
        """
            summary: return property
            description : returns property by id
        """
        json_dict = {"success":1}
        try:
            input_json = {}
            configs = Config(CONFIG_FILE_NAME)
            input_json['property_id'] = propertyId

            pph = PropertiesHandler(
                session=session, req_args=input_json, configs=configs)

            json_dict['propertyData'] = pph.retrieve_property()
            cherrypy.response.status = 200
        except Exception as exc:
            cherrypy.response.status = 400
            json_dict["success"] = 0
            cherrypy.log(str(exc))
        return json_dict

    @cherrypy.tools.json_out()
    @cherrypy.tools.verify_rights()
    @cherrypy.tools.require_permission()
    @cherrypy.tools.verify_record(model_name='PropertyBase', input_location=2)
    def DELETE(self, propertyId=None): #pylint: disable=invalid-name
        """
            summary: disable a property
            description : disables property by id
        """
        json_dict = {"success":1}
        try:
            input_json = {}
            configs = Config(CONFIG_FILE_NAME)
            input_json['property_id'] = propertyId
            # Initializing the Properties Handler object
            pph = PropertiesHandler(session=session, req_args=input_json)
            # Disabling the property
            pph.disable_property()
            session.commit()
            cherrypy.response.status = 200
            json_dict['propertyId'] = propertyId

        except PreludeError as exc:
            session.rollback()
            return exc.format_response(cherrypy.response)
        except Exception as exc:
            session.rollback()
            cherrypy.log(str(exc))
            cherrypy.response.status = 400
            json_dict['success'] = 0
            json_dict['details'] = str(exc)
        return json_dict
