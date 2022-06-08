"""
    Query Filter Builder
"""

import cherrypy
import prelude.models


from geoalchemy2 import Geometry
from prelude.errors import PreludeError
from sqlalchemy import func


class QueryFilterBuilder():
    """
        Builds Filters for Queries.
    """

    def __init__(
        self,
        parser=None,
        session=None,
        model_name=None,
        outer_model_name=None,
        configs=None):
        """
            parser is a QueryFilterParser object.
        """
        if session is None:
            details = 'No session passed'
            raise PreludeError('no_session_passed', details=details)
        if parser is None:
            details = 'No Query Filter Parser passed'
            raise PreludeError('', details=details)
        if model_name is None:
            details = 'No Model Name passed'
            raise PreludeError('', details=details)
        if configs is None:
            details = 'No configs passed'
            raise PreludeError('', details=details)
        self.session = session
        self.configs = configs
        self.parser = parser
        self.model = getattr(prelude.models, model_name)
        self.outer_model = None \
            if outer_model_name is None \
            else getattr(prelude.models, outer_model_name)
        self.query = self.session.query(self.model)
        self.filters= []


    def build_query_filters(self):
        """
            Calls _load_filters and _aggregate_filters methods.
        """

        self._load_filters()
        self._aggregate_filters()

    def _load_filters(self):
        """
            Loads all types of filters to the self.filters
            attribute.
        """
        self._load_range_filters()
        self._load_specialty_filters()
        self._load_simple_filters()

    def _aggregate_filters(self):
        """
            Aggregates all filters in self.filters, to the
            self.query attribute.
        """
        for filt in self.filters:
            self.query = self.query.filter(filt)

    def _load_range_filters(self):
        """
            Adds the filters, based on parsed filters in
            self.parser.parsed_range_filters,
            to the self.filters list.
        """
        parsed_range_filters = self.parser.parsed_range_filters
        for parsed_filter in parsed_range_filters:
            name = parsed_filter['name']
            value_from = parsed_filter['value_from']
            value_to = parsed_filter['value_to']

            column = getattr(self.model, name)

            if column is None:
                details = "Invalid field name '%s'" % name
                raise PreludeError('', details=details)

            filt = (column.between(value_from, value_to))
            self.filters.append(filt)

    def _load_distance_filter(self, parsed_filter):
        """
            Adds a distance filter to the self.filters list.
        """
        origin_point = parsed_filter['origin']
        radius = parsed_filter['radius']
        filt = (
            func.ST_Distance_Sphere(self.model.geo, origin_point)
            <= radius
        )
        self.filters.append(filt)

    def _load_specialty_filters(self):
        """
            Adds the filters, based on parsed filters in
            self.parser.parsed_specialty_filters,
            to the self.filters list.
        """
        parsed_specialty_filters = self.parser.parsed_specialty_filters
        for parsed_filter in parsed_specialty_filters:
            type_name = parsed_filter['type']
            method = getattr(self, "_load_%s_filter" % type_name)
            method(parsed_filter)

    def _get_operator_method(self, column=None, operator_string=None):
        method_names = self.configs['GeneralInfo']['SqlInfo']['operators']
        method_name = method_names.get(operator_string, None)
        if method_name is None:
            details="Unknown Operator '%s'" % operator_string
            raise PreludeError('', details=details)
        return getattr(column, method_name)

    def _load_simple_filters(self):
        """
            Adds the filters, based on parsed filters in
            self.parser.parsed_simple_filters,
            to the self.filters list.
        """
        parsed_simple_filters = self.parser.parsed_simple_filters
        for parsed_filter in parsed_simple_filters:
            name = parsed_filter['name']

            column = getattr(self.model, name)
            if column is None:
                details = "Invalid column name '%s'" % name
                raise PreludeError('', details=details)
            operator_method = self._get_operator_method(
                operator_string=parsed_filter['operator'],
                column=column
            )
            # operator_method is a method of the identified column.
            # Hence it receives a value parameter.
            self.filters.append(operator_method(parsed_filter['value']))



