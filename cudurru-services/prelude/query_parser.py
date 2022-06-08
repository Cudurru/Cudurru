"""
    Query Parser.
"""

import cherrypy

from prelude.errors import PreludeError
from prelude.query_filter_parser import QueryFilterParser

class QueryParser():
    """
        Parses query string arguments.
    """

    def __init__(self, req_args=None, configs=None):
        """
            req_args is a dictionary supposed to have
            a filters list.
        """
        if configs is None:
            details='No configs passed'
            raise PreludeError('', details=details)
        if req_args is None:
            details='No arguments passed'
            raise PreludeError('', details=details)
        self.configs = configs
        self.args = req_args
        self.filter_parser = QueryFilterParser(
            req_args=self.args,
            configs=self.configs
        )
        self.pagination = {}
        self.order_by = {}

    def _parse_order_by(self):
        """
            Parses order_by information (from args['order_by'])
            "fieldName:asc" or "fieldName:desc" is the expected format.
        """
        order_by_info = self.args.get('order_by')
        # If it was not passed, set it to configs default
        if order_by_info is None:
            sql_info = self.configs['GeneralInfo']['SqlInfo']
            order_by_info = sql_info['order_by']
            field_name = order_by_info['field_name']
            method = order_by_info['method']
            order_by_info = "{}:{}".format(field_name, method)

        field_name, method = order_by_info.split(':')
        properties = self.configs['Properties']
        order_by_fields = properties['get_query_order_by_fields']
        if field_name not in order_by_fields:
            details = "Field '%' not in order_by_fields" % field_name
            raise PreludeError('', details=details)
        snail_version = order_by_fields[field_name]['snail_version']
        self.order_by['field_name'] = snail_version
        self.order_by['method'] = method

    def parse_args(self):
        """
            Calls the parsing methods
        """
        try:
            self._parse_pagination()
            self._parse_filters()
            self._parse_order_by()
        except PreludeError as exc:
            raise PreludeError('', details=exc.details)

    def _parse_pagination(self):
        """
            Parses pagination information.
        """
        try:
            pagination_info = self.args.get('pagination')
            # If no pagination info was passed, set it to config file defaults.
            if pagination_info is None:
                sql_info = self.configs['GeneralInfo']['SqlInfo']
                pagination = sql_info['pagination']
                page = pagination['page']
                per_page = pagination['per_page']
                pagination_info = "{}:{}".format(page, per_page)
            page, per_page = pagination_info.split(':')
            self.pagination['page'] = int(page)
            self.pagination['per_page'] = int(per_page)
        except ValueError as exc:
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))
        except AttributeError as exc:
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))

    def _parse_filters(self):
        """
            Calls QueryFilterParser parse_filters method.
        """
        try:
            self.filter_parser.parse_filters()
        except PreludeError as exc:
            raise PreludeError('', details=exc.details)


