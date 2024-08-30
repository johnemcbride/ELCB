import mimetypes
from pathlib import Path
import os
import sys

AWS_S3_SIGNATURE_VERSION = 's3v4'  # Ensure this line is included
AWS_S3_REGION_NAME = 'eu-west-2'
mimetypes.add_type("image/svg+xml", ".svg", True)
mimetypes.add_type("image/svg+xml", ".svgz", True)

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-6kk)r$tlbt#8g@9*=z#)ybh&85jdn+5gp=#*91o8*$$d=c192a'


def str_to_bool(value: str) -> bool:
    """Convert a string representation of truth to boolean."""
    return value.lower() in ['true', '1', 'yes', 'y']


DEBUG = str_to_bool(os.environ.get('DEBUG', "False"))

ALLOWED_HOSTS = ['*']


CSRF_TRUSTED_ORIGINS = ['http://localhost']

WHITENOISE_MAX_AGE = 60*60*24

STATIC_URL = "/static/"
INSTALLED_APPS = [

    'jazzmin',
    'django_vite',
    'inertia',
    'yapp',
    'cms',
    'frontend',
    'nested_admin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "django_s3_sqlite",
    'wagtail.contrib.forms',
    'wagtail.contrib.redirects',
    'wagtail.embeds',
    'wagtail.sites',
    'wagtail.users',
    'wagtail.snippets',
    'wagtail.documents',
    'wagtail.images',
    'wagtail.search',
    'wagtail.admin',
    'wagtail',
    'wagtail.contrib.frontend_cache',
    'modelcluster',
    'taggit',
    'storages',
    'crispy_forms',
    'crispy_forms_gds',
    'wagtail.contrib.settings',
]


CRISPY_ALLOWED_TEMPLATE_PACKS = "gds"
CRISPY_TEMPLATE_PACK = "gds"


WAGTAIL_SITE_NAME = 'John Tech'
WAGTAILDOCS_EXTENSIONS = ['csv', 'docx', 'key',
                          'odt', 'pdf', 'pptx', 'rtf', 'txt', 'xlsx', 'zip']
WAGTAILADMIN_BASE_URL = 'http://localhost:8000'


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'wagtail.contrib.redirects.middleware.RedirectMiddleware',
    'inertia.middleware.InertiaMiddleware',

]

ROOT_URLCONF = 'mysite.urls'
INERTIA_LAYOUT = 'frontend/sign_up_page.html'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


DJANGO_VITE = {
    "default": {
        "dev_mode": DEBUG,
        "manifest_path": BASE_DIR / 'react-app' / 'dist'/'.vite'/'manifest.json'
    }
}

VITE_BASE_URL = os.getenv('VITE_BASE_URL', 'http://127.0.0.1:5173/')

# Where ViteJS assets are built.
DJANGO_VITE_ASSETS_PATH = BASE_DIR / 'react-app' / 'dist'
# If we should use HMR or not.
DJANGO_VITE_DEV_MODE = False
# we need this to get around cors issues
DJANGO_VITE_DEV_SERVER_HOST = '127.0.0.1'
# this is the default, but I'm leaving this here, so you know what to change if you want to run on a different port
DJANGO_VITE_PORT = 3000

WSGI_APPLICATION = 'mysite.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': '/tmp/db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/London'

USE_I18N = True

USE_TZ = True


STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {
            'bucket_name': os.environ['BUCKET_NAME'],
            'location': 'media/',
            'access_key': os.environ['AWS_ACCESS_KEY_ID'],
            'secret_key': os.environ['AWS_SECRET_ACCESS_KEY'],
            'security_token': os.environ['AWS_SESSION_TOKEN'],
            'region_name': os.environ.get('AWS_REGION_NAME', None),
        },
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}


MEDIA_URL = 'https://' + \
    os.environ['CLOUDFRONT_DISTRIBUTION_DOMAINNAME']+'/media/'


MEDIA_ROOT = None

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
SESSION_ENGINE = "django.contrib.sessions.backends.signed_cookies"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = [DJANGO_VITE_ASSETS_PATH]

if os.getenv('LAMBDA_TASK_ROOT'):
    print('Configuring for cloud')
    try:
        from .cloud_settings import *
    except ImportError as e:
        pass
