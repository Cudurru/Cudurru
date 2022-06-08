"""
    Query Filter Parser.
"""
import builtins
import cherrypy


from prelude.config import Config
from prelude.local_settings import (CONFIG_FILE_NAME)
from prelude.errors import PreludeError
from sqlalchemy import func


class QueryFilterParser():
    """
        Parses query string arguments.
    """

    def __init__(self, req_args=None, configs=None):
        """
            req_args is a dictionary supposed to have a
            filters list.
        """
        if configs is None:
           details = 'No configs passed'
           raise PreludeError('', details=details)
        if req_args is None:
           details = 'No arguments passed'
           raise PreludeError('', details=details)
        self.configs = configs
        self.config_fields = configs['Properties']['get_query_filter_fields']
        self.args = req_args
        self.parsed_simple_filters = []
        self.parsed_specialty_filters = []
        self.parsed_range_filters = []


    def parse_filters(self):
        """
            Parses a list of filters. Expects a list called
            'filters' to have been passed as args.
        """
        # Make sure fieldName happens only once per query
        # and an error is raised if it happens more than once.
        try:
            raw_filters = self.args.get('filters', [])
            config_fields = self.config_fields
            parsed_names = []
            for raw_filter in raw_filters:
                field_name = raw_filter.split(':')[0]

                if field_name not in config_fields:
                    details = "Invalid field name '%s'" % field_name
                    raise PreludeError('', details=details)
                if field_name in parsed_names:
                    details = "'%s' passed more than once" % field_name
                    raise PreludeError('', details=details)

                # Add it to parsed_names, so in case we find another with the
                # same name, we can throw an error.
                parsed_names.append(field_name)

                filter_type = config_fields[field_name]['filter_type']
                if type(filter_type) is dict:
                    specialty_type = filter_type['specialty']
                    self._add_specialty_filter(raw_filter, specialty_type)
                elif type(filter_type) is str:
                    method = getattr(self, "_add_%s_filter" % filter_type)
                    method(raw_filter)

        except PreludeError as exc:
            cherrypy.log('Parse Filter Failure: ' + exc.details)
            raise PreludeError(str(exc), details=exc.details)
        except AttributeError as exc:
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))


    def _add_specialty_filter(self, raw_filter, specialty_type):
        """
            Calls apropriate method based on specialty type.
        """
        method = getattr(self, "_add_%s_filter" % specialty_type)
        method(raw_filter)

    def _add_distance_filter(self, raw_filter):
        """
            arguments: raw_filter
                The expected raw_filter format is:
                'geo:longitude:latitude:radius'
                radius is in meters
            a dictionary will be added to parsed_specialty_filters,
            on the format:
                {
                    "origin": "POINT(<longitude> <latitude>)",
                    "radius": int(radius)
                    "type": distance
                }
        """
        try:
            field_name, longitude, latitude, radius = raw_filter.split(':')
            config_fields = self.config_fields

            if field_name not in config_fields:
                details = "Invalid field name '%s'" % field_name
                raise PreludeError('', details=details)

            config_field = config_fields.get(field_name)

            parsed_specialty_filter = {}

            origin = "POINT({} {})".format(longitude, latitude)

            parsed_specialty_filter['origin'] = origin
            parsed_specialty_filter['radius'] = int(radius)
            parsed_specialty_filter['type'] = 'distance'

            self.parsed_specialty_filters.append(parsed_specialty_filter)

        except PreludeError as exc:
            cherrypy.log('Add Specialty Filter Failure')
            raise PreludeError(str(exc), details=exc.details)
        except AttributeError as exc:
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))

    def _add_simple_filter(self, raw_filter):
        """
            arguments: raw_filter
                The expected raw_filter format is:
                'fieldName:operator:value'
                or
                'fieldName:range:value_from:value_to'
        """
        try:
            split_filter = raw_filter.split(':')
            config_fields = self.config_fields
            if len(split_filter) == 3:

                field_name, operator, value = split_filter


                if field_name not in config_fields:
                    details = "Invalid field name '%s'" % field_name
                    raise PreludeError('', details=details)

                config_field = config_fields.get(field_name)

                if operator not in config_field.get('operators'):
                    details = "Invalid filter operator '%s'" % operator
                    raise PreludeError('', details=details)

                snail_name = config_field.get('snail_version')
                # Dinamically casting the value.
                value_type = config_field.get('value_type')
                casted_value = getattr(builtins, value_type)(value)

                parsed_simple_filter = {}
                parsed_simple_filter['name'] = snail_name
                parsed_simple_filter['value'] = casted_value
                parsed_simple_filter['operator'] = operator

                self.parsed_simple_filters.append(parsed_simple_filter)
            # ToDo: add an elif to len==4, and an else to throw an error.
            elif len(split_filter) == 4:
                field_name, operator, value_from, value_to = split_filter

                if field_name not in config_fields:
                    details = "Invalid field name '%s'" % field_name
                    raise PreludeError('', details=details)

                config_field = config_fields.get(field_name)

                if operator not in config_field.get('operators'):
                    details = "Invalid filter operator '%s'" % operator
                    raise PreludeError('', details=details)

                snail_name = config_field.get('snail_version')

                value_type = config_field.get('value_type')
                casted_value_from = getattr(builtins, value_type)(value_from)
                casted_value_to = getattr(builtins, value_type)(value_to)

                parsed_range_filter = {}
                parsed_range_filter['name'] = snail_name
                parsed_range_filter['value_from'] = casted_value_from
                parsed_range_filter['value_to'] = casted_value_to

                self.parsed_range_filters.append(parsed_range_filter)

            else:
                details = "Invalid number of filter fields: '%s'" % raw_filter
                raise PreludeError('', details=details)

        # ToDo : explicitly catch cast errors
        except PreludeError as exc:
            cherrypy.log('Add Simple Filter Failure')
            raise PreludeError(str(exc), details=exc.details)
        except AttributeError as exc:
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))

