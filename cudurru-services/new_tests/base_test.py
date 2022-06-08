"""
    Helper classes for writing test
"""
from prelude.config import Config
from prelude.db import session as ses
from prelude.local_settings import (CONFIG_FILE_NAME)
from prelude.models import PropertyAsset, PropertyBase
from prelude.query_filter_parser import QueryFilterParser
from prelude.query_parser import QueryParser
from prelude.requests.properties import PropertiesHandler
from prelude.requests.property_asset import PropertyAssetHandler

import pytest
import os


class FileObject():
    def __init__(self, file_obj, filename):
        self.file = file_obj
        self.filename = filename


class Base():
    session = None
    created_file_list = None

    @pytest.yield_fixture(autouse=True)
    def nested_session(self, request):
        request.cls.session = ses

        # Deleting existing records, so test is predictable.
        ses.query(PropertyAsset).delete()
        ses.query(PropertyBase).delete()

        print('nested_session before')
        yield
        print('nested_session after')
        # Rolling back changes after test is done.
        ses.rollback()

    @pytest.yield_fixture(scope="class", autouse=True)
    def delete_test_created_files(self, request):
        request.cls.created_file_list = []
        yield
        for file_name in request.cls.created_file_list:
            if os.path.exists(file_name):
                os.remove(file_name)

class ORMHelpers(Base):
    """
        Managing database sessions and creating test data
    """
    configs = Config(CONFIG_FILE_NAME)
    test_configs = Config('./new_tests/test_configs.yml')

    # Full set of args.
    complete_property_args = {
        'legalDescription': 'This is a cool house we have here',
        'lotSize': '1500 sq ft',
        'yearBuilt': 1985,
        'askingPrice': 2999999,
        'postalCode': '12345',
        'latitude': 123.45,
        'longitude': 123.345
    }
    # Just lotSize and yearBuilt.
    update_property_args = {
        'lotSize': '1300 sq ft',
        'yearBuilt': 6666
    }
    # Bad because latitude and longitude expect float not strings.
    bad_property_args = {
        'latitude': '222.234',
        'longitude': '432.122',
        'legalDescription': 'Happy farmhouse'
    }
    
    # Invalid because our PropertyBase model 
    # does not have a field named jujuba
    invalid_property_args = {
        'jujuba': 777,
        'legalDescription': 'Beautiful Detroit Chateau',
    }
    # Empty disable_property_args
    disable_property_args = {}

    # Update args for property_asset
    update_property_asset_args = {
        'description': 'Kitchen picture'
    }

    raw_filter_args = {
        'filters': [
            'askingPrice:range:999:1500',
            'yearBuilt:ge:1985',
            'geo:-51.231214:-30.032839:850000'
        ],
        'pagination': "0:27"
    }

    source_file_name = 'test_assets/TestImage.jpg'

    def parse_args(self, req_args=None):
        """
            Instantiates a QueryParser object,
            calls the parse_args method and
            returns the object.
        """
        if req_args is None:
            req_args = self.raw_filter_args
        parser = QueryParser(
            configs=self.configs,
            req_args=req_args
        )
        parser.parse_args()

        return parser

    def parse_filters(self, req_args=None):
        """
            Instantiates a QueryFilterParser object,
            calls the parse_filters method and
            returns the object.
        """
        if req_args is None:
            req_args = self.raw_filter_args

        parser = QueryFilterParser(
            configs=self.configs,
            req_args=req_args
        )

        parser.parse_filters()

        return parser


    def create_test_property(self, req_args=None):
        """
            Instantiates a PropertiesHandler object,
            calls the create_property method and
            returns the object.
        """
        if req_args is None:
            req_args = self.complete_property_args

        pph = PropertiesHandler(
            configs=self.configs, session=self.session, req_args=req_args)
        pph.create_property()

        self.session.flush()

        return pph

    def store_test_property_asset(self, file_name=None, req_args=None):
        """
            Instantiates a PropertyAssetHandler object,
            calls the store_file_local method and
            returns the object
        """
        if file_name is None:
            file_name = self.source_file_name

        file_buffer = open(file_name, 'rb')

        # Instantiate mockup FileObject
        file_object = FileObject(
                file_obj=file_buffer,
                filename=file_name)

        pah = PropertyAssetHandler(
            session=self.session,
            req_args=req_args)

        pah.store_file_local(file_obj=file_object)

        # Add it to the created_file_list so it can be later removed
        # by the delete_test_created_files fixture
        self.created_file_list.append(pah.local_name)

        return pah
