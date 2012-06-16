
from django.conf.urls.defaults import patterns, include, url

_PREFIX = '__error__'

urlpatterns = patterns('client_errors.views',
    url(
        regex = r'^%s/media/(.*)$' % _PREFIX, 
        view  = 'media'
    ),
    url(
        regex = r'^%s/client/$' % _PREFIX,
        view  = 'error',
        name  = 'client_error'
    )
)
