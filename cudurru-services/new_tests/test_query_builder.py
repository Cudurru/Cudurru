"""
    Tests for the QueryBuilder class.
"""

from base_test import ORMHelpers
from prelude.config import Config
from prelude.errors import PreludeError
from prelude.local_settings import CONFIG_FILE_NAME
from prelude.query_builder import QueryBuilder
from prelude.query_parser import QueryParser

import pytest

class TestQueryBuilder(ORMHelpers):
    """
        This class contains tests for the methods
        in the QueryBuilder class.
    """

    def test_constructor(self):
        """
            This method contains tests for the constructor
            in the QueryBuilder class.
        """

        # Making sure if no session is passed, the proper exception is raised.
        with pytest.raises(PreludeError) as exc:
            builder = QueryBuilder()
        assert exc.value.details == 'No session passed'

        # Making sure if no QueryParser is passed, the proper exception is
        # raised.
        with pytest.raises(PreludeError) as exc:
            builder = QueryBuilder(session=self.session)
        assert exc.value.details == 'No Query Parser passed'

        # Making sure if no model_name is passed, the proper exception is
        # raised.
        with pytest.raises(PreludeError) as exc:
            parser = self.parse_args()
            builder = QueryBuilder(
                session=self.session,
                parser=parser
            )
        assert exc.value.details == 'No Model Name passed'

        # Making sure if no configs is passed, the proper exception is raised.
        with pytest.raises(PreludeError) as exc:
            parser = self.parse_args()
            builder = QueryBuilder(
                session=self.session,
                parser=parser,
                model_name='PropertyBase'
            )
        assert exc.value.details == 'No configs passed'

        #Testing successful initialization
        parser = self.parse_args()
        builder = QueryBuilder(
            session=self.session,
            parser=parser,
            model_name='PropertyBase',
            configs=self.configs
        )

        assert builder.session is not None
        assert builder.configs is not None
        assert builder.parser is not None
        assert builder.filter_builder is not None
        assert builder.query is not None

    def test_build_query(self):
        """
            Tests for the build_query method of
            the QueryBuilder class
        """
        # Adding the test config file properties:
        photos_per_property = 2
        for property_arg in self.test_configs['properties_args']:
            pph = self.create_test_property(property_arg)
            for number in range(0,photos_per_property):
                req_args = {}
                req_args['property_id'] = pph.property_base.id
                pah = self.store_test_property_asset(req_args=req_args)
                pah.create_property_asset()

        # Running for each filter_arg in the test_configs
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
            expected_results = filter_arg.get('expected_results') \
                if paginated_results is None \
                else paginated_results

            results = builder.query.all()

            assert len(results) == expected_results


