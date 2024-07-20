#!/bin/bash
set -e

# Restore the database if it does not already exist.
if [ -f /tmp/db.sqlite3 ]; then
	echo "Database already exists, skipping restore"
else
	echo "No database found, restoring from replica if exists"
	litestream restore -v -if-replica-exists -o /tmp/db.sqlite3 "${REPLICA_URL}"
fi

# Run litestream with your app as the subprocess.
exec litestream replicate -exec "pipenv run python manage.py runserver 0.0.0.0:8000"
