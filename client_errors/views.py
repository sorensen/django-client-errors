
import os

from django.views import static
from django.conf import settings
from django.contrib.auth.models import User
from django import http

from client_errors.models import UserError

def media(request, path):
    root = getattr(settings, 'CLIENT_ERROR_MEDIA_ROOT', None)
    if root is None:
        parent = os.path.abspath(os.path.dirname(__file__))
        root = os.path.join(parent, 'media', 'client_errors')
    return static.serve(request, path, root)

def error(request, *args, **kwargs):
    data = request.GET.copy()
    if request.method == 'POST':
        data = request.POST.copy()

    user = None
    if request.user.is_authenticated():
        user = request.user

    error = UserError.objects.create(
        created_by = user,
        message    = data.get('msg'),
        url        = data.get('url'),
        loc        = data.get('loc'),
        os         = data.get('os'),
        browser    = data.get('bw'),
        version    = data.get('vs'),
        device     = data.get('device'),
        plugins    = data.get('plugins'),
        locale     = data.get('locale'),
    )
    return http.HttpResponse(status=200)
