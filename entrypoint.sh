#!/bin/sh
# Activate pipenv environment and run Gunicorn
env
cd /app
litestream restore -config ./litestream.yml  /tmp/db.sqlite3
pipenv run which python
pipenv run which gunicorn
pipenv run gunicorn mysite.wsgi:application --bind 0.0.0.0:8000


# to increase memory on podman to allow pushes

  ELCB git:(main) ✗ podman machine stop
Machine "podman-machine-default" stopped successfully
➜  ELCB git:(main) ✗ podman machine list
NAME                     VM TYPE     CREATED      LAST UP         CPUS        MEMORY      DISK SIZE
podman-machine-default*  applehv     4 weeks ago  10 seconds ago  4           2GiB        100GiB
➜  ELCB git:(main) ✗ podman machine set --cpus 4 --memory 5012
➜  ELCB git:(main) ✗ podman machine list                      
NAME                     VM TYPE     CREATED      LAST UP         CPUS        MEMORY      DISK SIZE
podman-machine-default*  applehv     4 weeks ago  36 seconds ago  4           4.895GiB    100GiB
➜  ELCB git:(main) ✗ podman machine start              


# get into container
docker exec -it elcb-backend-1 /bin/bash