"""
WSGI config for priceditortobe project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'priceditortobe.settings')

application = get_wsgi_application()

# database = tobemx_templateeditor
# user = templateeditor
# pass = templateeditor@2019
# user + servidor 
# tobemx@web544.webfaction.com
# hacer una copia del settings ante del nano