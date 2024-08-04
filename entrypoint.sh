#!/bin/sh
# Activate pipenv environment and run Gunicorn
env
cd /app
litestream restore -config ./litestream.yml  /tmp/db.sqlite3
pipenv run which python
pipenv run which gunicorn
pipenv run gunicorn mysite.wsgi:application --bind 0.0.0.0:8000
