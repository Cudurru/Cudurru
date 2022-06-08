"""
    Prelude base configs and routings
"""
import cherrypy
from prelude.utility import \
    check_record_for_existence, error_page_500, \
    require_permission, set_cors_header, check_access_rights
from prelude.utilities.router import Route, Tree


if __name__ == '__main__':
    # Register our permissions checker.
    cherrypy.tools.require_permission = cherrypy.Tool(
        'before_handler', require_permission)

    # Save the BS of entering a function and seeing
    # if a record is there to alter.
    cherrypy.tools.verify_record = cherrypy.Tool('before_handler', \
            check_record_for_existence)

    cherrypy.tools.verify_rights = cherrypy.Tool(
        'before_handler', check_access_rights)
    # Register CORS fix
    cherrypy.tools.cors = cherrypy.Tool('before_request_body', set_cors_header)

    ROUTES = [
        Route(path='d', controller='prelude.routes.d.DThing'),
        Route(path='admin', controller='prelude.routes.admin.Admin'),
        Route(path='db', controller='prelude.routes.database.DatabaseTest'),
        Route(path='register', controller='prelude.routes.register.Register'),
        Route(path='login', controller='prelude.routes.login.Login'),
        Route(path='property', controller='prelude.routes.property.Property'),
        Route(path='user', controller='prelude.routes.user.User'),
        Route(path='propertyAsset',
              controller='prelude.routes.property_asset.PropertyAsset'),
        Route(path='propertyAssets',
            controller='prelude.routes.property_assets.PropertyAssets'),
        Route(path='properties',
            controller='prelude.routes.properties.Properties'),
        Route(path='resetpassword',
            controller='prelude.routes.reset_password.ResetPasswordRoute'),
    ]
    API_TREE = Tree(routes=ROUTES)
    APP = cherrypy.tree.mount(API_TREE, '/api', "prelude/server.conf")
    APP.merge('prelude/app.conf')
    #app.merge('prelude/secrets.conf')

    cherrypy.config.update({
        'server.socket_port': 8080,
        'server.max_request_body_size': 104857600,
        'tools.proxy.on': True,
        'tools.proxy.base': 'api.cudurru.test',
        'error_page.500': error_page_500,
    })
    #cherrypy.server.max_request_body_size = 100000000
    cherrypy.engine.start()
    cherrypy.engine.block()
