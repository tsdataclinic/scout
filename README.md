# A searchable interface for any Socrata Open Data Portal

![screenshot](https://scout.tsdataclinic.com/screenshot.png)

Introducing Scout, an open source tool that eases the discovery and curation of thematically related and joinable datasets to broaden the application of open data to uncover new insights.

Scout is designed to help surface datasets in open data portals that might have escaped your attention before.

At the moment, Scout only provides access to open data portals made accessible via the [Socrata API](https://socratadiscovery.docs.apiary.io/#).

Try it out [here](https://scout.tsdataclinic.com)

## Contributing

We love all contributions, be it a bug report or feature request via a GitHub issue, or feedback over email

## Roadmap

We will maintain a 6 month roadmap which you can read here: [roadmap](https://github.com/tsdataclinic/scout/blob/master/Roadmap.md). If you want clarification on the roadmap or have suggestions or other comments, please open an [issue](https://github.com/tsdataclinic/scout/issues).

## Development

If you want to help with the development of scout, you will need to be able to run the code locally.

### Prerequisites

Make sure you have the following installed:

- Node
- Yarn
- Postgres
- Docker

### Installing requirements

To get started clone the repo and install requirements:

```bash
git clone https://github.com/tsdataclinic/scout.git
cd scout
yarn install
```

### Running Elasticsearch

The search backend uses Elasticsearch. To run it locally, the easiest way to do it is with [docker-compose](https://docs.docker.com/compose/install/):

```
docker-compose -f docker-compose.yml up
```

Note if you see an error about max_map_count you need to increase that number with a command like

```
sudo sysctl -w vm.max_map_count=262144
```

### Populating your local database

The `ormconfig.json` in `packages/server/` is configured to point to a local postgres `scout` database. So we will need to create this database locally. First, start your postgres client:

```
psql postgres
```

Then, run the following commands inside it:

```
CREATE DATABASE scout;
CREATE USER postgres;
```

That's all you need to do in postgres. You can quit postgres by entering `\q`.

**Make sure you are in the `packages/server` directory for all of the next commands. These will not work correctly from the root directory.**

Change directory:

```
cd packages/server
```

Create the necessary postgres tables:

```bash
yarn sync-schema
```

If you see a message that says `Schema syncronization finished successfully.` then it means you're good to go. Now that the tables are created, you need to populate them with data. You will need to start up the API server with the `PORTAL_OVERRIDE_LIST` and `UPDATE_ON_BOOT` environment variables.

```
PORTAL_OVERRIDE_LIST=data.cityofnewyork.us,data.cityofchicago.org,data.nashville.gov UPDATE_ON_BOOT=true yarn start
```

This might take a while. It will populate postgres and elasticsearch with information from all the provided portals. In the command above, we are only populating with three portals to keep things from taking too long.

When you see the following message:

> Done updating all data

Then it means the data refresh is done. You should quit the server now (ctrl+C should do the trick). Next time you start the server you can just use `yarn start` as normal, without the `UPDATE_ON_BOOT` environment variable.

### Running the API server

The API server uses [NestJS](https://nestjs.com/) and runs on `https://localhost:5000`. To start the API server:

```
cd packages/server
yarn start
```

Note that we didn't need the `PORTAL_OVERRIDE_LIST` or `UPDATE_ON_BOOT` environment variables anymore. Those were only necessary for populating the database. You shouldn't need them again.

### Running the frontend server

The frontend is built in [React](https://reactjs.org/) and is bundled together using [Create React App](https://create-react-app.dev/). It runs on `https://localhost:3000` by default. To start the frontend server:

```
cd packages/frontend
yarn start
```

Then go to `https://localhost:3000` to view the application. You're all set up now!

## Socrata Data Discovery API

Main data source for the project is the Socrata Data Discovery API. API docs live here:

https://socratadiscovery.docs.apiary.io/

```

```
