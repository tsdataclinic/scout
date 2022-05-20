#!/bin/bash
# install all dependencies
cd /srv/scout
yarn install

# build the API server
cd /srv/scout/packages/server
cp /var/www/scout-server.env .env
yarn build

# Run the db migration
# TODO: use an actual migration script, which is what TypeORM recommends,
# instead of using the sync command
yarn sync-schema

# build the frontend
cd /srv/scout/packages/frontend
cp /var/www/scout-client.env .env
yarn build
