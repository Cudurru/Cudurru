"""
    Tools to reset and populate a testing environment
    command line only so they can't be accessed by nefarious interlopers
"""
from prelude.db import session
from prelude.models import User, Registration, PropertyBase, RegistrationCode
from prelude.requests.register_request import RegistrationHandler


if __name__ == '__main__':

    # define some users
    user1 = {"email":"somebody@something.co", "username": "Bob Somebody", "password": "password" }
    user2 = {"email":"thatperson@something.co", "username": "Cixin Somebody", "password": "password" }

    # wipe the database reg, user tables
    session.query(Registration).delete()
    session.query(RegistrationCode).delete()
    session.query(PropertyBase).delete()
    session.query(User).delete()

    # create our users
    rrh = RegistrationHandler(session=session, req_args=user1)
    rrh.create_user()
    session.commit()
