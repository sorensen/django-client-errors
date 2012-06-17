
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User

user_model = getattr(settings, 'CLIENT_ERROR_USER', User)

class UserError(models.Model):
    created     = models.DateTimeField(auto_now_add=True)
    created_by  = models.ForeignKey(to=user_model, null=True, blank=False, on_delete=models.SET_NULL)
    message     = models.CharField(max_length=256, blank=False, null=True)
    url         = models.CharField(max_length=256, blank=False, null=True)
    loc         = models.PositiveIntegerField(blank=False, null=True)
    os          = models.CharField(max_length=32, blank=False, null=True)
    browser     = models.CharField(max_length=32, blank=False, null=True)
    version     = models.CharField(max_length=32, blank=False, null=True)
    plugins     = models.CharField(max_length=128, blank=False, null=True)
    device      = models.CharField(max_length=256, blank=False, null=True)
    locale      = models.CharField(max_length=64, blank=False, null=True)
