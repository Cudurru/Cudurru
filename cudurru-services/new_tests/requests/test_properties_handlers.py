"""  This file contains tests for the properties request handler. """

from base_test import ORMHelpers
from prelude.config import Config
from prelude.db import session
from prelude.errors import PreludeError
from prelude.local_settings import (CONFIG_FILE_NAME)
from prelude.models import PropertyAsset, PropertyBase
from prelude.query_builder import QueryBuilder
from prelude.requests.properties import PropertiesHandler
from prelude.requests.property_asset import PropertyAssetHandler


import copy
import pytest



class TestPropertiesHandler(ORMHelpers):
    """
        This class contains tests for the methods in the
        properties request handler
    """


    def test_constructor(self):
        """
            This methods tests the constructor of
            the properties request handler.
        """
        # Testing not passing any arguments to the constructor.
        with pytest.raises(PreludeError) as exc:
            pph = PropertiesHandler()
        assert exc.value.details == 'No session passed'

        # Testing not passing session but passing configs.
        with pytest.raises(PreludeError) as exc:
            pph = PropertiesHandler(configs=self.configs)
        assert exc.value.details == 'No session passed'

        # Testing not passing just the arguments.
        with pytest.raises(PreludeError) as exc:
            pph = PropertiesHandler(configs=self.configs, session=self.session)
        assert exc.value.details == 'No arguments passed'

        # Testing succesfull initialization with full set of args.
        pph = PropertiesHandler(
            configs=self.configs,
            session=self.session,
            req_args=self.complete_property_args)

        assert isinstance(pph, PropertiesHandler)

    def test_attach_image_data(self):
        """
            Tests the _attach_image_data method
            of the PropertiesHandler class.
        """
        # Making sure the list is empty if there are no assets
        # related to that property.
        pph = self.create_test_property()
        asset_list = []
        pph._attach_image_data(
            property_base=pph.property_base,
            asset_list=asset_list
        )
        assert len(asset_list) == 0

        # Making sure there are x assets on the list, if that
        # property has x assets related to it.
        pph = self.create_test_property()

        # This is x
        photos_per_property = 3
        for number in range(0, photos_per_property):
            req_args = {}
            req_args['property_id'] = pph.property_base.id
            pah = self.store_test_property_asset(req_args=req_args)
            pah.create_property_asset()

        asset_list = []
        pph._attach_image_data(
            property_base=pph.property_base,
            asset_list=asset_list
        )
        assert len(asset_list) == photos_per_property

    def test_format_property_result(self):
        """
            Tests the _format_property_result method
            of the PropertiesHandler class.
        """
        pph = self.create_test_property()
        formatted_property_base = pph._format_property_result(
            property_base=pph.property_base
        )
        create_dict = self.complete_property_args
        for camel_name, value in create_dict.items():
            assert str(value) == formatted_property_base[camel_name]

    def test_general_query(self):
        """
            Tests the general_query method
            of the PropertiesHandler class.
        """
        # Create each property from the test config file.
        for property_arg in self.test_configs['properties_args']:
            self.create_test_property(property_arg)
        # For each filter arg in the test config file, run
        # the parser, the builder, and the general query method from
        # PropertyHandler. Check if the expected results match the results.

        for filter_arg in self.test_configs['filter_args']:
            parser = self.parse_args(filter_arg)
            builder = QueryBuilder(
                session=self.session,
                parser=parser,
                model_name='PropertyBase',
                configs=self.configs
            )
            builder.build_query()

            paginated_results = filter_arg.get('expected_paginated_results')
            # If paginated results is None (it is not on the filter_arg,
            # expected_results is equal to filter_arg['expected_results'],
            # otherwise it is equal to filter_arg['paginated_results']
            expected_results = filter_arg.get('expected_results') \
                if paginated_results is None \
                else paginated_results

            pph = PropertiesHandler(
                session=self.session,
                configs=self.configs,
                query_builder=builder,
                req_args={}
            )
            results = pph.general_query()
            #for result in results:
            #print(str(result))

            assert len(results) == expected_results

    def test_verify_configs(self):
        """
            This method tests the _verify_configs
            method of the properties request handler.
        """
        # Making sure if no configs are passed,
        # proper exception is thrown.
        with pytest.raises(PreludeError) as exc:
            pph = PropertiesHandler(
                req_args=self.complete_property_args,
                session=self.session)
            pph._verify_configs()
        assert exc.value.details == 'No configs passed'

        # Testing success case
        pph = PropertiesHandler(
            configs=self.configs,
            session=self.session,
            req_args=self.complete_property_args)
        pph._verify_configs()

    def test_retrieve_property(self):
        """
            Tests for the retrieve_property method
            of the PropertiesHandler class.
        """
        # Run for each property_arg in test config file.
        for property_arg in self.test_configs['properties_args']:
            # Add the property_arg to the datase.
            pph = self.create_test_property(property_arg)

            # Set input_json to the created property's uuid.
            input_json = {}
            input_json['property_id'] = str(pph.property_base.uuid)

            pph2 = PropertiesHandler(
                configs=self.configs,
                session=self.session,
                req_args=input_json
            )
            # Retrieve the property which has the target uuid.
            formatted_result = pph2.retrieve_property()
            create_dict = property_arg
            # Make sure the returned values, match the values from the config
            # file.
            for camel_name, value in create_dict.items():
                assert str(value) == formatted_result[camel_name]

    def test_create_property(self):
        """
            This method tests the create_property
            method of the properties request handler.
        """
        # Making sure if invalid property args are passed
        # they are not added to the model
        with pytest.raises(AttributeError) as exc:
            pph = self.create_test_property(self.invalid_property_args)
            getattr(pph.property_base, 'jujuba')

        # Testing correct initialization
        pph = self.create_test_property()

        # Asserting property_base attributes match passed arguments.
        config_fields = self.configs['Properties']['post_fields']
        for key, value in config_fields.items():
            field_name = value['snail_version']
            field_value = self.complete_property_args.get(key)
            assert getattr(pph.property_base, field_name) == field_value

        # Asserting the property metadata was correctly set.
        assert pph.property_base.enabled is True
        assert pph.property_base.uuid is not None
        assert pph.property_base.user_id is self.complete_property_args.get('user_id')

        rrh = self.session.query(PropertyBase).filter_by(uuid=str(pph.property_base.uuid)).first()
        assert rrh.uuid == pph.property_base.uuid



    def test_verify_property_id(self):
        """
            This method tests the verify_property_id
            method of the properties request handler.
        """

        # Making sure the proper exception is raised,
        # if no property_id is passed.
        with pytest.raises(PreludeError) as exc:
            req_args = self.complete_property_args
            pph = PropertiesHandler(
                configs=self.configs, session=self.session, req_args=req_args)
            pph.verify_property_id()
        assert exc.value.details == 'No Property Id Provided'

        # Making sure the proper exception is raised,
        # in case we pass an Id that is not in the database.
        with pytest.raises(PreludeError) as exc:
            req_args = self.complete_property_args
            req_args['property_id'] = ''
            pph = PropertiesHandler(
                configs=self.configs, session=self.session, req_args=req_args)
            pph.verify_property_id()
        assert exc.value.details == 'No matching Property found'
        # Resetting self.complete_property_args['property_id'].
        del self.complete_property_args['property_id']

        # Testing success case for verify_property_id.
        # We are creating a property and then using that
        # property's id to set the 'property_id' arg.
        pph = self.create_test_property()

        pph2 = PropertiesHandler(
            configs=self.configs,
            session=self.session,
            req_args=self.update_property_args)
        pph2.args['property_id'] = str(pph.property_base.uuid)
        pph2.verify_property_id()

        # Asserting the correct property was set
        # on pph's attribute property_bases.
        assert str(pph2.property_base.uuid) == pph2.args['property_id']


        # Resetting pph2.args['property_id'].
        del pph2.args['property_id']

    def test_update_property(self):
        """
            This method tests the update_property
            method of the properties request handler.
        """

        # Making sure the proper exception is raised,
        # if no property_id is passed.
        with pytest.raises(PreludeError) as exc:
            req_args = self.complete_property_args
            pph = PropertiesHandler(
                configs=self.configs, session=self.session, req_args=req_args)
            pph.update_property()
        assert exc.value.details == 'No Property Id Provided'

        # Making sure the proper exception is raised,
        # in case we pass a property_id that is not in the database.
        with pytest.raises(PreludeError) as exc:
            req_args = self.complete_property_args
            req_args['property_id'] = 'banana'
            pph = PropertiesHandler(
                configs=self.configs, session=self.session, req_args=req_args)
            pph.update_property()
        assert exc.value.details == 'No matching Property found'
        # Resetting self.complete_property_args['property_id'].
        del self.complete_property_args['property_id']

        # Testing success case for update property
        # Create a property with req_args_create args.
        create_args = self.complete_property_args
        update_args = self.update_property_args

        pph = self.create_test_property(create_args)
        # Set the update property_id args to the created property uuid.
        update_args['property_id'] = str(pph.property_base.uuid)

        # Instantiate the property with update_args arguments.
        pph2 = PropertiesHandler(
            configs=self.configs, session=self.session, req_args=update_args)
        # Make a deep copy of the property, before this step,
        # so later we can assert only the intented values were changed.
        pph2.verify_property_id()
        old_property_base = copy.deepcopy(pph2.property_base)

        # Update the property.
        pph2.update_property()

        new_property_base = pph2.property_base
        # Asserts:
        # Asserting the new_property_base attribute is not None.
        assert new_property_base is not None
        # Asserting the old_property_base attribute is not None.
        assert old_property_base is not None

        # The idea is to go through every config_field
        # and if it is also in update_args, assert if it equals
        # the new_property_base. If it is not on update_args,
        # assert if they equal old_property_base value.
        config_fields = self.configs['Properties']['put_fields']
        for key, value in config_fields.items():
            field_name = value['snail_version']
            new_value = getattr(new_property_base, field_name)
            if key not in update_args:
                old_value = getattr(old_property_base, field_name)
                assert old_value == new_value
            else:
                arg_value = update_args.get(key)
                assert arg_value == new_value

        # Assert metadata that wasn't supposed to change didn't.
        # updated_date only changes upon DB update.
        metadata_field_names = [
            'enabled',
            'uuid',
            'deactivated_date',
            'user_id',
            'created_date',
            'updated_date'
            ]

        for field_name in metadata_field_names:
            new_value = getattr(new_property_base, field_name)
            old_value = getattr(old_property_base, field_name)
            assert old_value == new_value

        # Resetting property_id.
        del update_args['property_id']
        # Rolling back session.

    def test_disable_property(self):
        """
            This method tests the disable_property
            method of the properties request handler.
        """

        # Making sure the proper exception is raised,
        # if no property_id arg is passed.
        with pytest.raises(PreludeError) as exc:
            req_args = self.complete_property_args
            pph = PropertiesHandler(
                configs=self.configs, session=self.session, req_args=req_args)
            pph.disable_property()
        assert exc.value.details == 'No Property Id Provided'

        # Making sure proper exception is raised,
        # if we pass a property_id that is not in the database.
        with pytest.raises(PreludeError) as exc:
            req_args = self.complete_property_args
            req_args['property_id'] = 'banana'
            pph = PropertiesHandler(
                configs=self.configs, session=self.session, req_args=req_args)
            pph.disable_property()
        assert exc.value.details == 'No matching Property found'
        # Resetting self.complete_property_args['property_id'].
        del self.complete_property_args['property_id']

        # Testing success case for disable_property

        create_args = self.complete_property_args
        disable_args = self.disable_property_args

        pph = self.create_test_property(create_args)

        # Set the update request property_id args to the created property uuid.
        disable_args['property_id'] = str(pph.property_base.uuid)

        # Instantiate the property handler with disable_args arguments.
        pph2 = PropertiesHandler(
                configs=self.configs, session=self.session, req_args=disable_args)

        # Disable the property.
        pph2.disable_property()

        # Asserting the correct property was disabled
        assert str(pph2.property_base.uuid) == disable_args['property_id']
        # Asserting the property was disabled
        assert pph2.property_base.enabled is False

        # Resseting property_id.
        del disable_args['property_id']







