import cherrypy
import prelude.models

from prelude.errors import PreludeError
from prelude.query_filter_builder import QueryFilterBuilder
from sqlalchemy import asc, desc

class QueryBuilder():
    """
        Builds a query.
    """

    def __init__(
        self,
        parser=None,
        session=None,
        model_name=None,
        configs=None):

        if session is None:
            details = 'No session passed'
            raise PreludeError('no_session_passed', details=details)
        if parser is None:
            details = 'No Query Parser passed'
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
        self.filter_builder = QueryFilterBuilder(
            parser=parser.filter_parser,
            session=self.session,
            configs=self.configs,
            model_name=model_name
        )
        self.query = self.filter_builder.query

    def _aggregate_order_by(self):
        """
            Aggregates order_by information, into our query.
        """
        order_by = self.parser.order_by
        column = getattr(self.model, order_by['field_name'])
        if order_by['method'] == 'asc':
            self.query = self.query.order_by(asc(column))
        else:
            self.query = self.query.order_by(desc(column))

    def build_query(self):
        """
            Calls self.filter_builder.build_query_filters
            and self._load_pagination methods
        """
        self.filter_builder.build_query_filters()
        self.query = self.filter_builder.query.filter(self.model.enabled==True)
        self._aggregate_order_by()
        self._load_pagination()

    def _load_pagination(self):
        per_page = self.parser.pagination['per_page']
        page = self.parser.pagination['page']
        self.query = self.query.limit(per_page)
        self.query = self.query.offset(per_page * page)

