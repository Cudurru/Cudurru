""" Login Request """

# import prelude.requests.login_request as LoginRequest
import bcrypt

from prelude.models import User
from prelude.errors import PreludeError


def get_valid_user(username, password, session):
    """
        Get user for login
    """
    users = session.query(User).filter_by(
        email=username, active_status=True).all()
    user_count = len(users)
    if user_count == 0:
        raise PreludeError('user_not_found', details="no active user found")
    if user_count > 1:
        raise PreludeError('multiple_users', details="Multiple Users Found")
    user = users[0]
    if not bcrypt.checkpw(password.encode('utf8'), user.password.encode('utf8')):
        raise PreludeError('invalid_password', details="Wrong Password")
    return user
