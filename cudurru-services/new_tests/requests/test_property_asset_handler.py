"""
    This file contains tests for the PropertyAssetHandler.
"""

#from new_tests.base_test import ORMHelpers
from base_test import ORMHelpers
from prelude.db import session
from prelude.errors import PreludeError
from prelude.models import PropertyAsset
from prelude.requests.property_asset import PropertyAssetHandler

import copy
import pytest
import os



class TestPropertiesAssetHandler(ORMHelpers):
    """
        This class contains tests for the methods in
        PropertyAssetHandler class.
    """

    def test_constructor(self):
        """
            This method tests the constructor of
            the PropertiesAssetHandler.
        """
        # Making sure proper exception is raised if we don't pass
        # a session to the constructor
        with pytest.raises(PreludeError) as exc:
            pah = PropertyAssetHandler()
        assert exc.value.details == 'No session passed'
        
        # Testing success case for the constructor
        pah = PropertyAssetHandler(session=self.session)
        
        assert isinstance(pah, PropertyAssetHandler)
    
    def test_store_file_local(self):
        """
            This method tests the store_file_local
            method of the PropertiesAssetHandler.
        """
        
        # store_test_property_asset method is in the
        # ORMHelper class.
        pah = self.store_test_property_asset()

        # Assert the local_name attribute was set.
        assert pah.local_name is not None
        # Assert the uuid attribute was set.
        assert pah.uuid is not None
        # Assert the file was created.
        assert os.path.exists(pah.local_name)

    def test_create_property_asset(self):
        """
            Tests the create_property_asset
            method of the PropertiesAssetHandler.
        """

        pph = self.create_test_property()
        req_args={}
        req_args['property_id'] = pph.property_base.id
        pah = self.store_test_property_asset(req_args=req_args)

        pah.create_property_asset()

        assert pah.asset is not None
        assert pah.asset.property_id == req_args['property_id']
        assert pah.asset.enabled is True
        assert pah.asset.uuid == pah.uuid
        assert pah.asset.local_name == pah.local_name

        

    def test_verify_property_asset_id(self):
        """
            Tests the verify_property_asset_id method
            of the PropertyAssetHandler.
        """
        
        # Making sure that if no property_asset_id is passed
        # the proper exception is raised.
        with pytest.raises(PreludeError) as exc:    
            req_args={}
            pah = PropertyAssetHandler(
                session=self.session,
                req_args=req_args)
            pah.verify_property_asset_id()
        assert exc.value.details == 'No Property Asset Id provided'
        
        # Making sure that if a property_asset_id that is not on database
        # is passed, the proper exception is raised.
        with pytest.raises(PreludeError) as exc:
            req_args={}
            req_args['property_asset_id'] = 'banana'
            pah = PropertyAssetHandler(
                session=self.session,
                req_args=req_args)
            pah.verify_property_asset_id()
        assert exc.value.details == 'No matching Property Asset found'

        # Testing success case for verify_property_asset_id.
        # Begin by creating a Test Property.
        pph = self.create_test_property()

        req_args={}
        req_args['property_id'] = pph.property_base.id
        # Store and create a Test Property Asset,
        # with Test Property uuid.
        pah = self.store_test_property_asset(req_args=req_args)
        pah.create_property_asset()

        req_args2 = {}
        req_args2['property_asset_id'] = str(pah.asset.uuid)
        pah2 = PropertyAssetHandler(
            session=self.session,
            req_args=req_args2)

        pah2.verify_property_asset_id()

        # Asserting pah2.asset was set, and is an instance of
        # PropertyAsset.
        assert isinstance(pah2.asset, PropertyAsset)
        # Asserting the correct property asset was loaded.
        assert pah2.asset.uuid == str(pah.asset.uuid)

    def test_update_property_asset(self):
        """
            Tests for the update_property_asset
            method of PropertyAssetHandler.
        """
        # Making sure that if no property_asset_id is passed
        # the proper exception is raised.
        with pytest.raises(PreludeError) as exc:    
            req_args={}
            pah = PropertyAssetHandler(
                session=self.session,
                req_args=req_args)
            pah.update_property_asset()
        assert exc.value.details == 'No Property Asset Id provided'
        
        # Making sure that if a property_asset_id that is not on database
        # is passed, the proper exception is raised.
        with pytest.raises(PreludeError) as exc:
            req_args={}
            req_args['property_asset_id'] = 'banana'
            pah = PropertyAssetHandler(
                session=self.session,
                req_args=req_args)
            pah.update_property_asset()
        assert exc.value.details == 'No matching Property Asset found'
        
        # Testing success case for update_property_asset.
        update_args = self.update_property_asset_args
        create_args = {}
        
        # Creates a property.
        pph = self.create_test_property()

        create_args['property_id'] = pph.property_base.id
        # Stores and create a property asset.
        pah = self.store_test_property_asset(req_args=create_args)
        pah.create_property_asset()

        # Set update_args['property_asset_id'] to the 
        # created property asset uuid.
        update_args['property_asset_id'] = str(pah.asset.uuid)
        
        # Instantiate the PropertyAssetHandler we will run
        # update_property_asset on.
        pah2 = PropertyAssetHandler(
            session=self.session,
            req_args=update_args)
        
        # Make a deep copy of the property asset before update is run.
        pah2.verify_property_asset_id()
        old_asset = copy.deepcopy(pah2.asset)
        
        # Run update_property_asset.
        pah2.update_property_asset()

        new_asset = pah2.asset
        
        # Assert that the expected changes happened.
        assert new_asset.description == update_args['description']
        
        # Asserting Metadata that wasn't supposed to change didn't.
        # update_date only changes upon DB update.
        metadata_field_names = [
                'user_id',
                'enabled',
                'uuid',
                'property_id',
                'local_name',
                'remote_name',
                'deactivated_date',
                'created_date',
                'updated_date'
                ]

        for field_name in metadata_field_names:
            new_value = getattr(new_asset, field_name)
            old_value = getattr(old_asset, field_name)
            assert old_value == new_value

        # Resseting property_asset_id
        del update_args['property_asset_id']

    def test_disable_property_asset(self):
        """
            Tests the disable_property_asset method
            of the PropertyAssetHandler.
        """
        # Making sure that if no property_asset_id is passed
        # the proper exception is raised.
        with pytest.raises(PreludeError) as exc:    
            req_args={}
            pah = PropertyAssetHandler(
                session=self.session,
                req_args=req_args)
            pah.disable_property_asset()
        assert exc.value.details == 'No Property Asset Id provided'
        
        # Making sure that if a property_asset_id that is not on database
        # is passed, the proper exception is raised.
        with pytest.raises(PreludeError) as exc:
            req_args={}
            req_args['property_asset_id'] = 'banana'
            pah = PropertyAssetHandler(
                session=self.session,
                req_args=req_args)
            pah.disable_property_asset()
        assert exc.value.details == 'No matching Property Asset found'
        
        # Testing success case for disable_property_asset.
        create_args = {}
        disable_args = {}
        # Creating a property.
        pph = self.create_test_property()

        create_args['property_id'] = pph.property_base.id
        # Store and create a property asset.
        pah = self.store_test_property_asset(req_args=create_args)
        pah.create_property_asset()
        
        # Set disable_args['property_asset_id'] to the
        # created property asset uuid.
        disable_args['property_asset_id'] = str(pah.asset.uuid)

        # Instantiate the PropertyAssetHandler we will run
        # disable_property_asset on.
        pah2 = PropertyAssetHandler(
                session=self.session,
                req_args=disable_args)
        
        pah2.disable_property_asset()

        # Asserting the correct property asset was disabled.
        assert str(pah2.asset.uuid) == disable_args['property_asset_id']
        # Asserting the property asset was disabled.
        assert pah2.asset.enabled is False



                



        




