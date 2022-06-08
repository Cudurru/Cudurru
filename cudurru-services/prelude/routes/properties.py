# pylint:disable=invalid-name, no-self-use, too-few-public-methods
# pylint:disable=fixme
"""
   Properties endpoints
"""
#import logging
import cherrypy
from prelude.config import Config
from prelude.db import session
from prelude.errors import PreludeError
from prelude.local_settings import (CONFIG_FILE_NAME)
from prelude.query_parser import QueryParser
from prelude.query_builder import QueryBuilder
from prelude.requests.properties import PropertiesHandler
from prelude.utility import validate_fields

@cherrypy.expose
@cherrypy.tools.cors()#pylint: disable=no-member # member is registered in base
class Properties():
    """
        Endpoint: /properties
        Summary: None
        Description: None
    """

    def OPTIONS(self):
        """
            Necessary for CORS
        """

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    @cherrypy.tools.require_permission()#pylint: disable=no-member # member is registered in base
    def POST(self):
        """
            Name: Property Creation
            Summary: create a new property object
            Description : creates a new property
        """
        json_dict = {"success": 1}
        try:
            session.rollback()
            input_json = cherrypy.request.json
            configs = Config(CONFIG_FILE_NAME)
            validate_fields(
                input_fields=input_json,
                config_fields=configs['Properties']['post_fields']
            )
            user = cherrypy.request.authed_user
            input_json['user_id'] = user
            pph = PropertiesHandler(
                session=session,
                req_args=input_json,
                configs=configs
            )
            pph.create_property()
            session.commit()
            cherrypy.response.status = 201
            json_dict['propertyId'] = str(pph.property_base.uuid)

        except PreludeError as exc:
            session.rollback()
            return exc.format_response(cherrypy.response)
        except Exception as exc:
            session.rollback()
            json_dict['success'] = 0
            json_dict['details'] = str(exc)
            cherrypy.response.status = 500
            cherrypy.serving.response.headers['Content-Type'] = \
                "application/json"
            cherrypy.log(str(exc))
        return json_dict

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def GET(self, filters=None, pagination=None, orderBy=None):
        """
            Name: Properties retrieval
            Summary: return properties
            Description : returns property(s) by query
        """
        json_dict = {"success":1}
        try:
            # If filters is not a list, make it a list
            # Because the QueryFilterParser expects it.
            if type(filters) is not type([]):
                filters = [filters] \
                    if filters is not None \
                    else []
            session.rollback()
            #cherrypy.log(str(filters))
            configs=Config(CONFIG_FILE_NAME)
            input_json = {}
            input_json['filters'] = filters
            input_json['pagination'] = pagination
            input_json['order_by'] = orderBy

            parser = QueryParser(
                req_args=input_json,
                configs=configs
            )
            parser.parse_args()
            builder = QueryBuilder(
                parser=parser,
                session=session,
                model_name='PropertyBase',
                configs=configs
            )
            builder.build_query()
            pph = PropertiesHandler(
                session=session,
                configs=configs,
                query_builder=builder,
                req_args=input_json
            )
            json_dict['properties'] = pph.general_query()
            cherrypy.response.status = 200
            """
            session.rollback()
            input_json = cherrypy.request.json
            pph = PropertiesHandler(session=session, req_args=input_json)
            pph.retrieve_property_within_radius()
            cherrypy.response.status = 200
            """

        except PreludeError as exc:
            session.rollback()
            return exc.format_response(cherrypy.response)
        except Exception as exc:
            session.rollback()
            json_dict['success'] = 0
            json_dict['details'] = str(exc)
            cherrypy.response.status = 500
            cherrypy.serving.response.headers['Content-Type'] = \
                "application/json"
            cherrypy.log(str(exc))
        return json_dict
