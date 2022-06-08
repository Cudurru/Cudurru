"""
database handle and possibly config
"""

# @Cleanup: Could this goto utility? Maybe get contained in a function?
# Will engine or connection ever be used?
import cherrypy
import sqlalchemy as db
from sqlalchemy.orm import scoped_session, sessionmaker
from prelude.local_settings import SQLALCHEMY_DATABASE_URI

engine = db.create_engine(SQLALCHEMY_DATABASE_URI) #pylint: disable=invalid-name
connection = engine.connect()#pylint: disable=invalid-name
# scoped_session so that each time this is called, the session is associated
# with it's thread.
session = scoped_session(sessionmaker(bind=engine))#pylint: disable=invalid-name
