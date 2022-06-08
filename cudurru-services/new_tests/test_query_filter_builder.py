"""
    Tests for the QueryFilterBuilder class.
"""

from base_test import ORMHelpers
from prelude.config import Config
from prelude.errors import PreludeError
from prelude.local_settings import CONFIG_FILE_NAME

from prelude.query_filter_builder import QueryFilterBuilder
from prelude.query_filter_parser import QueryFilterParser

import pytest


class TestQueryFilterBuilder(ORMHelpers):
    """
        This class contains tests for the methods
        in the QueryFilterBuilder class.
    """

    def test_constructor(self):
        """
            This method contains tests for the contructor
            in the QueryFilterBuilder class.
        """
        # Making sure if no session is passed, proper exception is raised.
        with pytest.raises(PreludeError) as exc:
            builder = QueryFilterBuilder()
        assert exc.value.details == 'No session passed'

        # Making sure if no QueryFilterParser is passed, proper exception is
        # raised.
        with pytest.raises(PreludeError) as exc:
            builder = QueryFilterBuilder(session=self.session)
        assert exc.value.details == 'No Query Filter Parser passed'

        # Making sure if no model_name is passed, proper exception is raised.
        with pytest.raises(PreludeError) as exc:
            parser = self.parse_filters()
            builder = QueryFilterBuilder(
                session=self.session,
                parser=parser
            )
        assert exc.value.details == 'No Model Name passed'

        # Making sure if no configs are passed, proper exception is raised.
        with pytest.raises(PreludeError) as exc:
            parser = self.parse_filters()
            builder = QueryFilterBuilder(
                session=self.session,
                parser=parser,
                model_name='PropertyBase'
            )
        assert exc.value.details == 'No configs passed'

        # Testing successful initialization
        parser = self.parse_filters()
        builder = QueryFilterBuilder(
            session=self.session,
            parser=parser,
            model_name='PropertyBase',
            configs=self.configs
        )

        assert builder.session is not None
        assert builder.configs is not None
        assert builder.parser is not None
        assert builder.model is not None
        assert builder.query is not None
        assert builder.filters is not None
        assert len(builder.filters) == 0

    def test_build_query_filters(self):
        """
            Tests for the build_query_filters method
            of the QueryFilterBuilder class.
        """
        # Adding the test config file properties:
        photos_per_property = 2
        for property_arg in self.test_configs['properties_args']:
            pph = self.create_test_property(property_arg)
            for number in range(0,photos_per_property):
                req_args={}
                req_args['property_id'] = pph.property_base.id
                pah = self.store_test_property_asset(req_args=req_args)
                pah.create_property_asset()

        # Running for each filter_arg in the test_configs
        for filter_arg in self.test_configs['filter_args']:
            parser = self.parse_filters(filter_arg)
            builder = QueryFilterBuilder(
                session=self.session,
                parser=parser,
                model_name='PropertyBase',
                outer_model_name='PropertyAsset',
                configs=self.configs
            )
            builder.build_query_filters()
            expected_results = filter_arg.get('expected_results')
            results = builder.query.all()
            assert len(results) == expected_results

    def test_aggregate_filters(self):
        """
            Tests for the _aggregate_filters method
            of the QueryFilterBuilder class.
        """
        # Adding the test config file properties:
        for property_arg in self.test_configs['properties_args']:
            pph = self.create_test_property(property_arg)
            req_args={}
            req_args['property_id'] = pph.property_base.id
            pah = self.store_test_property_asset(req_args=req_args)
            pah.create_property_asset()

        # Running for each filter_arg in the test_configs
        for filter_arg in self.test_configs['filter_args']:
            parser = self.parse_filters(filter_arg)
            builder = QueryFilterBuilder(
                session=self.session,
                parser=parser,
                model_name='PropertyBase',
                configs=self.configs
            )
            builder._load_filters()
            builder._aggregate_filters()
            expected_results = filter_arg.get('expected_results')
            results = builder.query.all()
            assert len(results) == expected_results

    def test_load_filters(self):
        """
            Tests for the _load_filters method
            of the QueryFilterBuilder class.
        """
        parser = self.parse_filters()
        builder = QueryFilterBuilder(
            session=self.session,
            parser=parser,
            model_name='PropertyBase',
            configs=self.configs
        )
        builder._load_filters()

        assert len(builder.filters) == 3

        # Running for each filter_arg in the test_configs
        for filter_arg in self.test_configs['filter_args']:
            parser = self.parse_filters(filter_arg)
            builder = QueryFilterBuilder(
                session=self.session,
                parser=parser,
                model_name='PropertyBase',
                configs=self.configs
            )
            builder._load_filters()
            total_filters = 0
            total_filters += filter_arg['specialty_number']
            total_filters += filter_arg['simple_number']
            total_filters += filter_arg['range_number']

            assert len(builder.filters) == total_filters

    def test_load_range_filters(self):
        """
            Tests for the _load_range_filters method
            of the QueryFilterBuilder class.
        """
        parser = self.parse_filters()
        builder = QueryFilterBuilder(
            session=self.session,
            parser=parser,
            model_name='PropertyBase',
            configs=self.configs
        )
        builder._load_range_filters()
        assert len(builder.filters) == 1

    def test_load_specialty_filters(self):
        """
            Tests for the _load_specialty_filters method
            of the QueryFilterBuilder class.
        """
        parser = self.parse_filters()
        builder = QueryFilterBuilder(
            session=self.session,
            parser=parser,
            model_name='PropertyBase',
            configs=self.configs
        )
        builder._load_specialty_filters()

        assert len(builder.filters) == 1


    def test_load_simple_filters(self):
        """
           Tests for the _load_simple_filters method
           of the QueryFilterBuilder class.
        """
        parser = self.parse_filters()
        builder = QueryFilterBuilder(
            session=self.session,
            parser=parser,
            model_name='PropertyBase',
            configs=self.configs
        )
        builder._load_simple_filters()

        assert len(builder.filters) == 1


    def test_get_operator_method(self):
        """
            Tests for the _get_operator_method method
            of the QueryFilterBuilder class.
        """
        parser = self.parse_filters()
        builder = QueryFilterBuilder(
            session=self.session,
            parser=parser,
            model_name='PropertyBase',
            configs=self.configs
        )
        column = builder.model.year_built

        operator_string = 'alfafa'
        with pytest.raises(PreludeError) as exc:
            operator = builder._get_operator_method(
                column=column,
                operator_string=operator_string
            )
        assert exc.value.details == "Unknown Operator '%s'" % operator_string


        # Testing passing the 'eq' as operator_string.
        operator = builder._get_operator_method(
            column=column,
            operator_string='eq'
        )

        assert operator is not None
        assert operator == column.__eq__

        # Testing passing the 'ge' as operator_string.
        operator = builder._get_operator_method(
            column=column,
            operator_string='ge'
        )

        assert operator is not None
        assert operator == column.__ge__

        # Testing passing the 'gt' as operator_string.
        operator = builder._get_operator_method(
            column=column,
            operator_string='gt'
        )

        assert operator is not None
        assert operator == column.__gt__

        # Testing passing the 'le' as operator_string.
        operator = builder._get_operator_method(
            column=column,
            operator_string='le'
        )

        assert operator is not None
        assert operator == column.__le__

        # Testing passing the 'lt' as operator_string.
        operator = builder._get_operator_method(
            column=column,
            operator_string='lt'
        )

        assert operator is not None
        assert operator == column.__lt__


