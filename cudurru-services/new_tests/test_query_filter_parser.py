"""
    Tests for the QueryFilterParser class.
"""
from prelude.config import Config
from prelude.errors import PreludeError
from prelude.local_settings import CONFIG_FILE_NAME
from prelude.query_filter_parser import QueryFilterParser as Parser

import pytest

class TestQueryFilterParser():
    """
        This class contains tests for the methods
        in the QueryFilterParser class.
    """
    configs = Config(CONFIG_FILE_NAME)

    test_configs = Config('./new_tests/test_configs.yml')

    valid_args = {
        'filters': [
            'yearBuilt:ge:1985',
            'askingPrice:range:1000:2000',
            'geo:123.123:123.123:16000',
        ],
        'pagination': "10:15"
    }
    two_year_built_args = {
        'filters': [
            'yearBuilt:ge:1992',
            'yearBuilt:ge:1900'
        ]
    }
    invalid_name_args = {
        'filters': [
            'banana:ge:1975'
        ]
    }
    # invalid because there is no pagination
    invalid_operator_args = {
        'filters': [
            'yearBuilt:banana:1894'
        ]
    }

    def test_constructor(self):
        """
            This method tests the constructor of
            the QueryFilterParser class.
        """
        # Testing not passing configs to the constructor.
        with pytest.raises(PreludeError) as exc:
            parser = Parser()
        assert exc.value.details == 'No configs passed'

        # Testing not passing req_args to the constructor.
        with pytest.raises(PreludeError) as exc:
            parser = Parser(configs=self.configs)
        assert exc.value.details == 'No arguments passed'

        # Testing successful initialization

        parser = Parser(configs=self.configs, req_args=self.valid_args)

        assert isinstance(parser, Parser)
        assert parser.args is not None
        assert len(parser.parsed_simple_filters) == 0
        assert len(parser.parsed_specialty_filters) == 0
        assert len(parser.parsed_range_filters) == 0

    def test_add_simple_filter(self):
        """
            This method tests the _add_simple_filter
            method of the QueryFilterParser class.
        """
        # Making sure proper exception is raised, in case
        # we receive a field name that is not in the config file.
        with pytest.raises(PreludeError) as exc:
            parser = Parser(
                configs=self.configs,
                req_args=self.valid_args
            )
            parser._add_simple_filter(raw_filter='banana:eq:1985')
        assert exc.value.details == "Invalid field name 'banana'"

        # Making sure proper exception is raised, in case
        # we receive an invalid operator.
        with pytest.raises(PreludeError) as exc:
            parser = Parser(
                configs=self.configs,
                req_args=self.valid_args
            )
            parser._add_simple_filter(raw_filter='yearBuilt:banana:1985')
        assert exc.value.details == "Invalid filter operator 'banana'"



        # Testing success case for _add_simple_filter
        parser = Parser(configs=self.configs, req_args=self.valid_args)

        field_name = 'yearBuilt'
        snail_name = 'year_built'
        operator = 'eq'
        value = '1985'

        raw_filter = "{}:{}:{}".format(field_name, operator, value)

        parser._add_simple_filter(raw_filter)

        # Asserting there is one element in the parsed_simple_filters
        assert len(parser.parsed_simple_filters) == 1

        parsed_filter = parser.parsed_simple_filters[0]

        # Asserting the dict was properly set.
        assert parsed_filter['name'] == snail_name
        assert parsed_filter['operator'] == operator
        assert parsed_filter['value'] == int(value)
        assert type(parsed_filter['value']) == int

    def test_add_specialty_filter(self):
        """
            Tests the _add_specialty_filter method
            of the QueryFilterParser class.
        """

        # Testing success case for _add_specialty_filter
        parser = Parser(
            configs=self.configs,
            req_args=self.valid_args,
        )
        raw_filter = 'geo:123.45:123.123:16000'

        parser._add_specialty_filter(raw_filter, 'distance')

        assert len(parser.parsed_specialty_filters) == 1

        parsed_filter = parser.parsed_specialty_filters[0]

        assert parsed_filter['origin'] == 'POINT(123.45 123.123)'
        assert parsed_filter['radius'] == 16000

    def test_parse_filters(self):
        """
            Tests for the parse_filters method of
            the QueryFilterParser class.
        """
        # Assert that proper exception is raised
        # if we pass invalid name on the raw_filters.
        with pytest.raises(PreludeError) as exc:
            parser = Parser(
                configs=self.configs,
                req_args=self.invalid_name_args
            )
            parser.parse_filters()
        assert exc.value.details == "Invalid field name 'banana'"

        # Assert that the proper exception is raised
        # if we pass invalid operator on the raw_filters.
        with pytest.raises(PreludeError) as exc:
            parser = Parser(
                configs=self.configs,
                req_args=self.invalid_operator_args
            )
            parser.parse_filters()
        assert exc.value.details == "Invalid filter operator 'banana'"

        # Assert that the proper exception is raised
        # if we pass more than one of the same filter
        with pytest.raises(PreludeError) as exc:
            parser = Parser(
                configs=self.configs,
                req_args=self.two_year_built_args
            )
            parser.parse_filters()
        assert exc.value.details == "'yearBuilt' passed more than once"

        # Testing success case for parse_filters
        parser = Parser(
            configs=self.configs,
            req_args=self.valid_args
        )

        parser.parse_filters()

        assert len(parser.parsed_simple_filters) == 1
        assert len(parser.parsed_specialty_filters) == 1
        assert len(parser.parsed_range_filters) == 1

        # For each of the filter_arg in test configs,
        # make sure the proper number of each filter type
        # was parsed.
        for filter_arg in self.test_configs['filter_args']:
            parser = Parser(
                configs=self.configs,
                req_args=filter_arg
            )
            parser.parse_filters()

            specialty_number = filter_arg.get('specialty_number')
            simple_number = filter_arg.get('simple_number')
            range_number = filter_arg.get('range_number')
            assert len(parser.parsed_simple_filters) == simple_number
            assert len(parser.parsed_specialty_filters) == specialty_number
            assert len(parser.parsed_range_filters) == range_number







