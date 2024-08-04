#!/bin/sh
# Activate pipenv environment and run Gunicorn
cd /app
pipenv run which python
pipenv run which gunicorn
pipenv run gunicorn mysite.wsgi:application --bind 0.0.0.0:8000
