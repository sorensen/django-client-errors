
import os

from django.conf import settings
from django.utils.encoding import smart_unicode
from django.conf.urls.defaults import include
from django.conf.urls.defaults import patterns
from django.template.loader import render_to_string

import client_errors.urls

_HTML_TYPES = (
    'text/html', 
    'application/xhtml+xml'
)

class ClientErrorMiddleware(object):
    """
    """
    def __init__(self):
        self.original_urlconf = settings.ROOT_URLCONF
        self.original_pattern = patterns('', ('', include(self.original_urlconf)),)
        self.override_url = getattr(settings, 'CLIENT_ERRORS_AUTO', True)

    def load_template(self, request):
        return render_to_string('client_errors/base.html', {
            'BASE_URL': request.META.get('SCRIPT_NAME', ''),
        })

    def load_js(self):
        return render_to_string('media/clientError.js')

    def replace_insensitive(self, string, target, replacement):
        """
        Similar to string.replace() but is case insensitive
        Code borrowed from: http://forums.devshed.com/python-programming-11/case-insensitive-string-replace-490921.html
        """
        no_case = string.lower()
        index = no_case.rfind(target.lower())
        if not not ~index:
            return string[:index] + replacement + string[index + len(target):]
        return string

    def process_request(self, request):
        if self.override_url:
            # Workaround for debug_toolbar
            urlconf = getattr(request, 'urlconf', False)
            if urlconf:
                client_errors.urls.urlpatterns += patterns('', ('', include(urlconf)),)
            else:
                client_errors.urls.urlpatterns += self.original_pattern
            self.override_url = False
        request.urlconf = 'client_errors.urls'

    def process_response(self, request, response):
        if response['Content-Type'].split(';')[0] in _HTML_TYPES:
            response.content = self.replace_insensitive(
                string      = smart_unicode(response.content), 
                target      = u'</body>', 
                replacement = smart_unicode(self.load_template(request) + u'</body>')
            )
        return response
