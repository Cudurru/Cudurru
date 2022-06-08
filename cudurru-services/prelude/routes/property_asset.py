# pylint:disable=invalid-name, no-self-use, too-few-public-methods
# pylint:disable=fixme
"""
    Property Asset endpoint
"""
import cherrypy
from prelude.db import session
from prelude.errors import PreludeError
from prelude.requests.property_asset import PropertyAssetHandler

@cherrypy.expose
@cherrypy.tools.cors()#pylint: disable=no-member # member is registered in base
class PropertyAsset():
    """
        Endpoint: /propertyAsset/{propertyId}
        Summary: None
        Description: None
    """

    def OPTIONS(self):
        """
            Necessary for CORS
        """

    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    @cherrypy.tools.verify_rights()
    @cherrypy.tools.require_permission()#pylint: disable=no-member # member is registered in base
    @cherrypy.tools.verify_record(model_name='PropertyAsset',\
            input_location=2)
    def PUT(self, propertyAssetId=None):
        """
            summary: update a property asset information
        """
        json_dict = {'success': 1}
        try:
            session.rollback()
            input_json = cherrypy.request.json
            input_json['property_asset_id'] = propertyAssetId
            pah = PropertyAssetHandler(session=session, req_args=input_json)
            pah.update_property_asset()
            session.commit()
            cherrypy.response.status = 200
            json_dict['propertyAssetId'] = str(pah.asset.uuid)
        except PreludeError as exc:
            session.rollback()
            return exc.format_response(cherrypy.response)
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.response.status = 400
            json_dict['success'] = 0
            json_dict['details'] = str(exc)
        return json_dict

    @cherrypy.tools.json_out()
    @cherrypy.tools.verify_rights()
    @cherrypy.tools.require_permission()
    @cherrypy.tools.verify_record(model_name='PropertyAsset',\
            input_location=2)
    def DELETE(self, propertyAssetId=None): #pylint: disable=invalid-name
        """
            summary: disable a property asset record
            description:
        """
        json_dict = {"success": 1}
        try:
            input_json = {}
            input_json['property_asset_id'] = propertyAssetId
            pah = PropertyAssetHandler(session=session, req_args=input_json)
            pah.disable_property_asset()
            session.commit()
            cherrypy.response.status = 200
            json_dict['propertyAssetId'] = str(pah.asset.uuid)

        except PreludeError as exc:
            session.rollback()
            return exc.format_response(cherrypy.response)
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.response.status = 400
            json_dict['success'] = 0
            json_dict['details'] = str(exc)
        return json_dict
