# pylint:disable=invalid-name
""" Models file """
from geoalchemy2 import Geometry
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import func, Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import expression
from sqlalchemy.types import  Boolean, DateTime, Float, Integer, String


# Helper to map and register a Python class a db table
BASE = declarative_base()


class User(BASE):  # pylint: disable=too-few-public-methods
    """
        Users table model
    """
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String, unique=True)
    name = Column(String)
    password = Column(String)
    activated_date = Column(DateTime)
    active_status = Column(Boolean)
    reset_code = Column(String)
    deactivated_date = Column(DateTime)
    # This needs to be both here, and in create_users_table for some reason!
    created_date = Column(DateTime, server_default=func.now())
    updated_date = Column(DateTime, server_default=func.now(),
                          onupdate=func.current_timestamp())

class Registration(BASE):  # pylint: disable=too-few-public-methods
    """
        Registration records model
    """
    __tablename__ = 'registrations'
    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String)
    headers = Column(String)
    deactivated_date = Column(DateTime)
    created_date = Column(DateTime, server_default=func.now())
    updated_date = Column(DateTime, server_default=func.now(),
                          onupdate=func.current_timestamp())


class RegistrationCode(BASE):  # pylint: disable=too-few-public-methods
    """
        Registration Codes record model
    """
    __tablename__ = 'registration_codes'
    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String)
    code = Column(String)
    deactivated_date = Column(DateTime)
    created_date = Column(DateTime, server_default=func.now())
    updated_date = Column(DateTime, server_default=func.now(),
                          onupdate=func.current_timestamp())


class PropertyAsset(BASE): #pylint: disable=too-few-public-methods
    """
        Model for assets, mostly images, associated woth a building
    """
    __tablename__ = 'property_assets'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    enabled = Column(Boolean, default=False, server_default=expression.true())
    uuid = Column(String, unique=True)
    property_id = Column(Integer, ForeignKey('property_bases.id'))
    local_name = Column(String)
    remote_name = Column(String)
    description = Column(String)
    deactivated_date = Column(DateTime)
    created_date = Column(DateTime, server_default=func.now())
    updated_date = Column(DateTime, server_default=func.now(),
                          onupdate=func.current_timestamp())
    property_base = relationship(
        "PropertyBase",
        back_populates="property_assets")

class PropertyBase(BASE): # pylint: disable=too-few-public-methods
    """
        Model for the basic building
    """
    __tablename__ = 'property_bases'
    id = Column(Integer, primary_key=True)
    legal_description = Column(String)
    lot_size = Column(String)
    description = Column(String)
    square_footage = Column(Integer)
    bedroom_count = Column(Integer)
    bathroom_count = Column(Float)
    address1 = Column(String)
    address2 = Column(String)
    state = Column(String)
    city = Column(String)
    year_built = Column(Integer)
    asking_price = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)
    postal_code = Column(String)
    geo = Column(Geometry(geometry_type='POINT'))
    #default is python side default, server_default is db side default
    enabled = Column(Boolean, default=False, server_default=expression.true())
    uuid = Column(String, unique=True)
    deactivated_date = Column(DateTime)
    user_id = Column(Integer, ForeignKey('users.id'))
    created_date = Column(DateTime, server_default=func.now())
    updated_date = Column(DateTime, server_default=func.now(),
                          onupdate=func.current_timestamp())
    property_assets = relationship(
        "PropertyAsset",
        order_by=PropertyAsset.id,
        primaryjoin= "and_(PropertyAsset.enabled==True,"
            "PropertyAsset.property_id==PropertyBase.id)",
        back_populates="property_base")
    user = relationship("User", back_populates="properties")

User.properties = relationship(
    "PropertyBase",
    order_by=PropertyBase.id,
    back_populates="user",
    primaryjoin="and_(PropertyBase.enabled==True,"
        "User.id==PropertyBase.user_id)"
)
