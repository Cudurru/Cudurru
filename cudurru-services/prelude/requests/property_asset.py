"""
    Property Asset Request
"""
#import sqlalchemy as sa
import os
from datetime import datetime
from uuid import uuid4
import cherrypy
import logging

from prelude.local_settings import UPLOAD_DIR
from prelude.models import PropertyAsset
from prelude.errors import PreludeError


class PropertyAssetHandler():
    """
        Manages ORM style requests for databases access related to property assets
    """

    def __init__(self, session=None, req_args=None):
        if session is None:
            details = "No session passed"
            raise PreludeError('no_session_passed', details=details)
        self.session = session
        self.args = req_args
        self.remote_name = None
        self.uuid = None
        self.local_name = None
        self.asset = None

    def verify_property_asset_id(self):
        """
            Verifies if the property_asset_id was passed and
            if there is a property asset in the database with that
            property_asset_id. Sets self.asset to that property asset.
        """
        try:
            property_asset_id = self.args.get("property_asset_id")
            if property_asset_id is None:
                raise PreludeError('', details='No Property Asset Id provided')
            asset = self.session.query(PropertyAsset).\
                filter_by(uuid=property_asset_id).\
                filter_by(enabled=True).first()
            if asset is None:
                raise PreludeError('no_item_by_id', details='No matching Property Asset found')
            self.asset = asset
        except PreludeError as exc:
            cherrypy.log("Verify Property Asset Id Failure")
            raise PreludeError(str(exc), details=exc.details)
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))

    def update_property_asset(self):
        """
           Updates a property asset record.
           Expects property_asset_id argument to be
           set to an existing property asset uuid.
        """
        try:
            self.verify_property_asset_id()
            self.asset.description = self.args.get('description')
        except PreludeError as exc:
            cherrypy.log('Update Property Asset Failure')
            raise PreludeError(str(exc), details=exc.details)
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))

    def disable_property_asset(self):
        """
            Sets the enabled column of a property asset record
            to false.
            Expects property_asset_id argument to be
            set to an existing property asset uuid.
        """
        try:
            # Verifies property_asset_id was passed correctly
            # and sets self.asset to the target ORM object.
            self.verify_property_asset_id()
            # Sets self.asset.enabled to False.
            self.asset.enabled = False
            # Updates self.asset.deactivated_date
            self.asset.deactivated_date = datetime.now()
        except PreludeError as exc:
            cherrypy.log('Disable Property Asset Failure')
            raise PreludeError(str(exc), details=exc.details)
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))

    def create_property_asset(self):
        """
            add a property to the database
            get its unique id back
        """
        asset = PropertyAsset()
        asset.local_name = self.local_name
        asset.uuid = str(self.uuid)
        asset.enabled = True
        asset.property_id = self.args.get('property_id')
        asset.user_id = self.args.get('user_id')
        self.session.add(asset)
        self.asset = asset

    def store_file_local(self, file_obj):
        """
            store file on local file system prior to sending to remote content server
            will also have to create a job for later deletion
            also sets the self.local_name variable to the name of the file created
            and self.uuid to the asset's uuid.
        """
        try:
            # put path into configs
            # upload_path = '/path/to/project/data/'
            # upload_path = os.path.dirname(__file__)
            original_filename = file_obj.filename
            of_suffix = original_filename.split('.')[-1]
            uuid = uuid4()
            self.uuid = str(uuid)
            upload_name = str(uuid) + "." + of_suffix
            upload_file = os.path.normpath(os.path.join(UPLOAD_DIR, upload_name))
            self.local_name = upload_file
            size = 0
            with open(upload_file, 'wb') as out:
                while True:
                    data = file_obj.file.read(8192)
                    if not data:
                        break
                    out.write(data)
                    size += len(data)
        except Exception as exc:
            logging.info(str(exc))
            raise PreludeError('local_upload_failed', details=str(exc))

    def store_file_remote(self):
        """
            move file to remote content service
        """
        try:
            cherrypy.log(self.local_name)
        except Exception as exc:
            raise PreludeError('', details=str(exc))

    def update_property_asset_with_remote_name(self):
        """
            after moving to remote server we get a new name for the file
        """
        self.asset.remote_name = ''
        self.session.add(self.asset)
