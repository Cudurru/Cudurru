"""
    Property Request
"""
#import sqlalchemy as sa
from datetime import datetime
from uuid import uuid4
import cherrypy

from geoalchemy2 import Geometry
from prelude.config import Config
from prelude.local_settings import (CONFIG_FILE_NAME)
from prelude.models import PropertyBase
from prelude.errors import PreludeError
from sqlalchemy import func

class PropertiesHandler():
    """
        Manages ORM style requests for databases access related to properties
    """

    def __init__(
        self,
        session=None,
        req_args=None,
        configs=None,
        query_builder=None):

        if session is None:
            details = "No session passed"
            raise PreludeError('no_session_passed', details=details)
        # This needs to move to the appropriate methods
        if req_args is None:
            details = "No arguments passed"
            raise PreludeError('', details=details)

        self.session = session
        self.args = req_args
        self.register_code = ''
        self.property_base = None
        self.configs = configs
        self.query_builder = query_builder

    def retrieve_property(self):
        """
            Retrieves a single property from the database
            formats the return into a dict.
        """
        # Make sure configs were passed
        self._verify_configs()
        # Set the self.property_base attribute to the ORM object with the
        # given property_id args.
        self.verify_property_id()
        # Format and return the result
        return (self._format_property_result(property_base=self.property_base))

    def general_query(self):
        """
            Expects a query_builder to have been passed on the constructor.
            Based on the query_builder provided, constructs a query, executes
            it and format the return into a list of dicts.
        """
        # Make sure configs were passed.
        self._verify_configs()

        # Execute query.
        results = self.query_builder.query.all()

        # Format the return
        formatted_return = []

        for result in results:
            formatted_result = self._format_property_result(result)
            #cherrypy.log(str(formatted_result))
            formatted_return.append(formatted_result)

        #cherrypy.log(str(formatted_return))

        return formatted_return


    def _format_property_result(self, property_base):
        """
            Formats of a property ORM object into a dict and returns it.
            Contents of the dict are specified by the config file.
        """
        formatted_result = {}
        properties = self.configs['Properties']
        return_fields = properties['get_query_return_fields'].items()
        for camel_name, value in return_fields:
            result = str(getattr(property_base, value['snail_version']))
            if result != "None":
                formatted_result[camel_name] = result
        formatted_result['assetList'] = []
        self._attach_image_data(
            property_base=property_base,
            asset_list=formatted_result['assetList']
        )
        return formatted_result

    def _attach_image_data(self, property_base, asset_list):
        """
            Appends all the image objects that a
            property_base has to asset_list.
        """
        #cherrypy.log(str(property_base.property_assets))
        for asset in property_base.property_assets:
            asset_info = {}
            asset_info['description'] = asset.description
            asset_info['assetName'] = asset.local_name.split('/')[-1]
            asset_list.append(asset_info)

    def create_property(self):
        """
            This method assumes the arguments were previously validated
            adds a property to the database
            sets self.property_base to the newly created property
        """
        lot = PropertyBase()

        try:
            self._verify_configs()
            config_fields = self.configs['Properties']['post_fields']

            # Setting all the lot attributes that are in config fields
            # to the ones that were passed as arguments. Also sets
            # the attribute to none, if it wasn't passed.
            for key, value in config_fields.items():
                field_name = value['snail_version']
                field_value = self.args.get(key)
                setattr(lot, field_name, field_value)

            # Setting metadata attributes
            lot.enabled = True
            lot.user_id = self.args.get("user_id")
            lot.uuid = uuid4()

            if lot.longitude is None:
                lot.longitude = 0
            if lot.latitude is None:
                lot.latitude= 0

            lot.geo = 'POINT({} {})'.format(
                lot.longitude,
                lot.latitude)

            self.session.add(lot)
            self.property_base = lot

        except AttributeError as exc:
            #ToDo-Create or identify error code
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))

    def verify_property_id(self):
        """
            verifies a propertyId is correct and active
            also sets the self.property_base attribute
        """
        try:
            property_id = self.args.get("property_id")
            if property_id is None:
                raise PreludeError('', details="No Property Id Provided")
            #property_base = self.session.query(PropertyBase).get({"id":property_id})
            property_base = self.session.query(PropertyBase).\
                filter_by(uuid=property_id).\
                filter(PropertyBase.enabled==True).first()

            if property_base is None:
                raise PreludeError('no_item_by_id', details="No matching Property found")
            self.property_base = property_base
        except PreludeError as exc:
            cherrypy.log("Verify Property Id Failure")
            raise PreludeError(str(exc), details=exc.details)
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))

    def update_property(self):
        """
            Updates a property record
            and sets self.property_base object.
            Expects validated arguments.
            Expects property_id arg to be set
            to the Id of the target property.
        """
        try:
            #this method verifies property_id
            #and sets self.property_base object
            self.verify_property_id()
            self._verify_configs()
            config_fields = self.configs['Properties']['put_fields']
            for key, value in config_fields.items():
                if key not in self.args:
                    continue
                field_name = value['snail_version']
                field_value = self.args.get(key)
                setattr(self.property_base, field_name, field_value)

            if self.property_base.latitude is None:
                self.property_base.latitude = 0
            if self.property_base.longitude is None:
                self.property_base.longitude = 0

            self.property_base.geo = 'POINT({} {})'.format(
                self.property_base.longitude,
                self.property_base.latitude)

        except PreludeError as exc:
            cherrypy.log('Update Property Failure')
            raise PreludeError(str(exc), details=exc.details)
        except AttributeError as exc:
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))

    def _verify_configs(self):
        if self.configs is None:
            details = 'No configs passed'
            raise PreludeError('', details=details)


    def disable_property(self):
        """
            Disables a property record, by setting
            self.property_base.enabled argument to false.
            Also updates the deactivated_time parameter.
            Expects property_id argument to be set
            to the Id of the target property.
        """

        try:
            # Verifies property_id was passed correctly and
            # sets self.property_base to the target object.
            self.verify_property_id()

            # Setting the enabled attribute to False.
            self.property_base.enabled = False

            # Updating the deactivated_date attribute to
            # datetime.now().
            self.property_base.deactivated_date = datetime.now()

        except PreludeError as exc:
            cherrypy.log('Disable Property Failure')
            raise PreludeError(str(exc), details=exc.details)
        except AttributeError as exc:
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))


