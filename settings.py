
# default settings override these in settings_local.py
DATABASES = {
    'default' : {
        'ENGINE'         : 'django.db.backends.mysql',
        'NAME'           : 'django_client_errors',
        'HOST'           : 'localhost',
        'PORT'           : 3306,
        'USER'           : 'root',
        'PASSWORD'       : '',
        'STORAGE_ENGINE' : 'INNODB'
    }
}

INSTALLED_APPS = (
    'south',
    'client_errors'
)
