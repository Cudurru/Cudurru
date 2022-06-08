"""
    Tests for the QueryParser class.
"""
from prelude.config import Config
from prelude.errors import PreludeError
from prelude.local_settings import CONFIG_FILE_NAME
from prelude.query_parser import QueryParser as Parser

import pytest

class TestQueryParser():
    """
        This class contains tests for the methods
        in the QueryParser class.
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
    invalid_operator_args = {
        'filters': [
            'yearBuilt:banana:1894'
        ]
    }
    # Invalid because it contains non numbers other than ':'
    invalid_pagination_args = {
        'pagination': 'yearBuilt:Banana'
    }
    def test_contructor(self):
        """
            This method tests the contructor of
            the QueryParser class.
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
        assert parser.filter_parser is not None
        assert len(parser.filter_parser.parsed_simple_filters) == 0
        assert len(parser.filter_parser.parsed_specialty_filters) == 0
        assert len(parser.filter_parser.parsed_range_filters) == 0
        assert parser.pagination == {}

    def test_parse_args(self):
        """
            Tests for the parse_args method
            of the QueryParser class.
        """

        for filter_arg in self.test_configs['filter_args']:
            parser = Parser(
                configs=self.configs,
                req_args=filter_arg
            )
            parser.parse_args()

            # x_number is got from the filter_arg (that is in the test configs)
            specialty_number = filter_arg.get('specialty_number')
            simple_number = filter_arg.get('simple_number')
            range_number = filter_arg.get('range_number')

            # x_parsed is got from the parser's lists.
            specialty_parsed = len(
                parser.filter_parser.parsed_specialty_filters
            )
            simple_parsed = len(parser.filter_parser.parsed_simple_filters)
            range_parsed = len(parser.filter_parser.parsed_range_filters)

            assert parser.pagination['page'] == filter_arg['page']
            assert parser.pagination['per_page'] == filter_arg['per_page']
            assert simple_parsed == simple_number
            assert specialty_parsed == specialty_number
            assert range_parsed == range_number



    def test_parse_filters(self):
        """
            Tests for the _parse_filters method of
            the QueryParser class.
        """
        # Assert that proper exception is raised
        # if we pass invalid name on the raw_filters.
        with pytest.raises(PreludeError) as exc:
            parser = Parser(
                configs=self.configs,
                req_args=self.invalid_name_args
            )
            parser._parse_filters()
        assert exc.value.details == "Invalid field name 'banana'"

        # Assert that the proper exception is raised
        # if we pass invalid operator on the raw_filters.
        with pytest.raises(PreludeError) as exc:
            parser = Parser(
                configs=self.configs,
                req_args=self.invalid_operator_args
            )
            parser._parse_filters()
        assert exc.value.details == "Invalid filter operator 'banana'"

        # Assert that the proper exception is raised
        # if we pass more than one of the same filter
        with pytest.raises(PreludeError) as exc:
            parser = Parser(
                configs=self.configs,
                req_args=self.two_year_built_args
            )
            parser._parse_filters()
        assert exc.value.details == "'yearBuilt' passed more than once"

        parser = Parser(
            configs=self.configs,
            req_args=self.valid_args
        )

        parser.filter_parser.parse_filters()

        assert len(parser.filter_parser.parsed_simple_filters) == 1
        assert len(parser.filter_parser.parsed_specialty_filters) == 1
        assert len(parser.filter_parser.parsed_range_filters) == 1


        # For each of the filter_arg in test configs,
        # make sure the proper number of each filter type
        # was parsed.
        for filter_arg in self.test_configs['filter_args']:
            parser = Parser(
                configs=self.configs,
                req_args=filter_arg
            )
            parser._parse_filters()


            specialty_number = filter_arg.get('specialty_number')
            simple_number = filter_arg.get('simple_number')
            range_number = filter_arg.get('range_number')
            specialty_parsed = len(
                parser.filter_parser.parsed_specialty_filters
            )
            simple_parsed = len(parser.filter_parser.parsed_simple_filters)
            range_parsed = len(parser.filter_parser.parsed_range_filters)

            assert simple_parsed == simple_number
            assert specialty_parsed == specialty_number
            assert range_parsed == range_number

    def test_parse_pagination(self):
        """
            Tests the _parse_pagination method
            of the QueryParser class.
        """
        expected = "invalid literal for int() with base 10: 'yearBuilt'"
        with pytest.raises(PreludeError) as exc:
            parser = Parser(
                configs=self.configs,
                req_args=self.invalid_pagination_args
            )
            parser._parse_pagination()
        assert exc.value.details == expected


        parser = Parser(
            configs=self.configs,
            req_args= self.valid_args
        )

        parser._parse_pagination()

        sql_info = self.configs['GeneralInfo']['SqlInfo']
        config_pagination = sql_info['pagination']

        pagination = parser.pagination
        assert (pagination['page']) == 10
        assert (pagination['per_page']) == 15

        # Testing that config default is set, if no pagination arg is passed
        parser = Parser(
            configs=self.configs,
            req_args= {}
        )

        parser._parse_pagination()

        sql_info = self.configs['GeneralInfo']['SqlInfo']
        config_pagination = sql_info['pagination']

        pagination = parser.pagination
        assert (pagination['page']) == config_pagination['page']
        assert (pagination['per_page']) == config_pagination['per_page']
