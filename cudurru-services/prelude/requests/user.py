"""
    User Request
"""
import cherrypy
from prelude.errors import PreludeError
from prelude.requests.properties import PropertiesHandler
from prelude.models import User
from sqlalchemy import func

class UserRequestHandler():
    """
        Manage ORM style requests for database access related
    """

    def __init__(self, session=None, req_args=None, configs=None):

        if session is None:
            details = "No session passed"
            raise PreludeError('no_session_passed', details=details)
        if req_args is None:
            details = "No arguments passed"
            raise PreludeError('', details=details)
        if configs is None:
            details = "No configs passed"
            raise PreludeError('', details=details)

        self.session = session
        self.args = req_args
        self.configs = configs
        self.user = None

    def verify_user_id(self):
        """
            verifies the user_id is correct and active
            also sets the self.user attribute
        """
        try:
            user_id = self.args.get("user_id")
            if user_id is None:
                details = "No User Id Provided"
                raise PreludeError('', details=details)
            user = self.session.query(User).\
                filter_by(id=user_id).\
                filter(User.active_status==True).first()
            if user is None:
                details = "No matching User found"
                raise PreludeError('no_item_by_id', details=details)
            self.user = user
        except PreludeError as exc:
            cherrypy.log("Verify User Id Failure")
            raise PreludeError(str(exc), details=exc.details)
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))

    def retrieve_user_info(self):
        """
            retrieves user info, based on 'user_id' field of self.args
        """

        try:
            # setting self.user / verifying it exists
            self.verify_user_id()

            return self._format_user_result()
        except Exception as exc: #pylint: disable=broad-except
            cherrypy.log(str(exc))
            raise PreludeError('', details=str(exc))

    def _format_user_result(self):

        # creating this object to reuse the _format_property_result method!
        pph = PropertiesHandler(
            session=self.session,
            req_args=self.args,
            configs=self.configs
        )

        formatted_return = {}
        formatted_return['userName'] = self.user.username
        formatted_return['email'] = self.user.email
        formatted_return['name'] = self.user.name
        formatted_return['createDate'] = str(self.user.created_date)
        formatted_return['propertyList'] = []

        for property_base in self.user.properties:
            formatted_result = pph._format_property_result(property_base)
            formatted_return['propertyList'].append(formatted_result)

        return formatted_return

