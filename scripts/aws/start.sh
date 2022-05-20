#!/bin/bash
# start the API server
cd /srv/scout/packages/server
pm2 start "yarn start:prod" --name server

# start the frontend server
cd /srv/scout/packages/frontend
pm2 start "serve -s build" --name frontend
