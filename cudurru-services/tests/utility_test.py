""" utilityhelper """
import pytest
import prelude.utility as Utility
from prelude_test import PreludeTest
from prelude.errors import PreludeError


class UtilityTest(PreludeTest):
    """ utilityhelper """

    def test_utility_hash_password(self):
        """test_utility_hash_password"""

    def test_utility_validate_fields(self):
        """test_utility_validate_fields"""
        Utility.validate_fields(
            {"fname": "testtest", "email": "test@fsdfsd.com"},
            {
                "fname": {"required": True, "minimum_length": 4, "maximum_length": 20},
                "email": {"required": True, "type": "email"},
            }
        )

    def test_utility_validate_fields_min_length(self):
        """test_utility_validate_fields_min_length"""
        with pytest.raises(PreludeError):
            Utility.validate_fields(
                {"fname": "tet"},
                {
                    "fname": {"minimum_length": 4},
                }
            )

    def test_utility_validate_fields_max_length(self):
        """test_utility_validate_fields_max_length"""
        with pytest.raises(PreludeError):
            Utility.validate_fields(
                {"fname": "testtest2"},
                {
                    "fname": {"maximum_length": 8},
                }
            )

    def test_utility_validate_fields_email(self):
        """test_utility_validate_fields_email"""
        with pytest.raises(PreludeError):
            Utility.validate_fields(
                {"email": "test@fsdfsdcom"},
                {
                    "email": {"type": "email"},
                }
            )

    def test_utility_validate_fields_required(self):
        """test_utility_validate_fields"""
        with pytest.raises(PreludeError):
            Utility.validate_fields(
                {},
                {"fname": {"required": True}}
            )

    def test_utility_send_email(self):
        """test_registration_send_registration_email"""
        config = {
            "email": {
                "from_email": "seth@doercreator.com",
                "method": "method1"
            },
            "method1": {
                "username": "",
                "password": "",
                "host": "localhost",
                "port": 1025,
            }
        }
        Utility.send_email("test", "test_subject", "body", config)

    def test_utiity_generate_code(self):
        """generate_code"""
        Utility.generate_code()

    def test_login_generate_jwt(self):
        """test_login_generate_jwt"""
        Utility.generate_jwt(1)
