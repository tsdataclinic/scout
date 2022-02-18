# A new searchable interface for New York Open Data (or any socrata data portal)

![screenshot](https://tsdataclinic.github.io/scout/screenshot.png)

Introducing scout, an open source browser-based tool that eases the discovery and curation of thematically related and joinable datasets to broaden the application of open data to uncover new insights.

Scout is designed to help surface datasets in the NYC Open Data Portal that might have escaped your attention before.

Try it out [here](http://twosigma.com/scout)

## Contributing

We love all contributions, be it a bug report or feature request via a GitHub issue, or feedback over email

## Roadmap

We will maintain a 6 month roadmap which you can read here: [roadmap](https://github.com/tsdataclinic/scout/blob/master/Roadmap.md). If you want clarification on the roadmap or have suggestions or other comments, please open an [issue](https://github.com/tsdataclinic/scout/issues).

## Development

If you want to help with the development of scout, you will need to be able to run the code locally. Scout is built using [React](https://reactjs.org/) and for development we use [yarn](https://classic.yarnpkg.com/en/).

To get started install yarn and then run the following in a terminal from the repo root:

```bash
yarn install
```

We use elastic search for some features. To run it locally, the easiest way to do it is with docker-compose:

```
docker-compose up
```

Note if you see an error about max_map_count you need to increase that number with a command like

```
 sudo sysctl -w vm.max_map_count=262144
```

Once that is done, run the following from the repo root:

```
yarn start
```

If you wanted to run the backend and frontend separately, you will need to go to `packages/frontend` and `packages/server` and run `yarn start` inside each.

### Local database setup

To develop locally we recommend using sqlite. The `ormconfig.json` in `packages/server/` is configured to point to a sqlite3 database in `packages/server/db/`. To set up the tables you should run:

```bash
yarn sync-schema
```

To populate it with data you need to start up the server with the `UPDATE_ON_BOOT` environment variable set. RUn the following:

```
UPDATE_ON_BOOT=true yarn start
```

The portal refresh takes a little bit of time. When you see the following message:

> IMPORT COMPLETE: All data portals have been updated

Then it means the data refresh is done. Next time you start the server you can just use `yarn start` as normal, without the `UPDATE_ON_BOOT` environment variable.

## Socrata Data Discovery API

Main data source for the project is the Socrata Data Discovery API. API docs live here:

https://socratadiscovery.docs.apiary.io/

```

```
