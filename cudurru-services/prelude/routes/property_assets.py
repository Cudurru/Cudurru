# pylint:disable=invalid-name, no-self-use, too-few-public-methods
# pylint:disable=fixme
"""
    Property Assets endpoint
"""
import cherrypy
from prelude.db import session
from prelude.errors import PreludeError
from prelude.requests.property_asset import PropertyAssetHandler

@cherrypy.expose
@cherrypy.tools.cors()#pylint: disable=no-member # member is registered in base
class PropertyAssets():
    """
        Endpoint: /propertyAssets/{propertyId}
        Summary: None
        Description: None
    """

    def OPTIONS(self):
        """
            Necessary for CORS
        """

    @cherrypy.tools.json_out()
    @cherrypy.tools.verify_rights()
    @cherrypy.tools.require_permission()#pylint: disable=no-member # member is registered in base
    @cherrypy.tools.verify_record(model_name='PropertyBase',\
            input_location=2)
    def POST(self, propertyId=None, file_obj=None): #pylint: disable=invalid-name, unused-argument
        """
            summary: upload a property asset like photos
            description:
        """
        json_dict = {"success": 1}
        try:
            session.rollback()
            input_json = {}
            user = cherrypy.request.authed_user
            input_json['user_id'] = user
            property_id = cherrypy.request.identified_record.id
            input_json['property_id'] = property_id
            pah = PropertyAssetHandler(session=session, req_args=input_json)
            pah.store_file_local(file_obj)
            pah.create_property_asset()
            #pah.store_file_remote()
            #pah.update_property_asset_with_remote_name()
            session.commit()
            cherrypy.response.status = 201
            json_dict['propertyAssetId'] = str(pah.uuid)

        except PreludeError as exc:
            session.rollback()
            return exc.format_response(cherrypy.response)
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.response.status = 400
            json_dict["success"] = 0
            json_dict["details"] = str(exc)
        return json_dict
