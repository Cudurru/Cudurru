""" Config """
import yaml
from prelude.errors import PreludeError


class Config():
    def __init__(self, config_file_name=""):
        try:
            with open(config_file_name, 'r') as config_file_data:
                self.configs = yaml.safe_load(config_file_data)
        except FileNotFoundError as exc:
            details = "config file not found"
            raise PreludeError('file_not_found', details=details)

    def __getitem__(self, item):
        return self.configs[item]
