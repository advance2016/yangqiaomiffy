"""
WSGI config for miffy project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/howto/deployment/wsgi/
"""

import sys

sys.path.append('/usr/local/python3/lib/python3.6/site-packages/django')
sys.path.append('/usr/local/python3/lib/python3.6/site-packages/pytz')
sys.path.append('/root/miffy/')
sys.path.append('/root/miffy/miffy/')


import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "miffy.settings")

application = get_wsgi_application()
