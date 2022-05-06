# Scout

![Screenshot of Scout](https://scout.tsdataclinic.com/screenshot.png)

Scout is a data discovery tool for open data portals. It is an open source product that eases the search and curation of thematically related and joinable datasets to broaden the application of open data to uncover new insights.

Scout is designed to help surface datasets in open data portals that might have escaped your attention before.

At the moment, Scout only provides access to open data portals made accessible via the [Socrata API](https://socratadiscovery.docs.apiary.io/#).

Try it out [here](https://scout.tsdataclinic.com).

## Table of Contents

1. [Contributing](#1-contributing)
2. [Roadmap](#2-roadmap)
3. [Developing](#3-developing)
4. [Troubleshooting](#4-troubleshooting)

## 1. Contributing

We love all contributions, be it a bug report or feature request via a GitHub issue, or feedback over email.

## 2. Roadmap

**A new roadmap is coming up soon for 2022.**

## 3. Developing

If you want to help with the development of Scout, you need to be able to run the code locally.

### 3.1 Prerequisites

Make sure you have the following installed:

- Node
- Yarn
- Postgres (on MacOS we recommend installing with [Homebrew](https://brew.sh/) rather than a manual download)
- Docker

### 3.2 Installing requirements

To get started clone the repo and install requirements:

```bash
git clone https://github.com/tsdataclinic/scout.git
cd scout
yarn install
```

### 3.3 Running Elasticsearch

The search backend uses Elasticsearch. To run it locally, the easiest way to do it is with [docker-compose](https://docs.docker.com/compose/install/):

```
docker-compose -f docker-compose.yml up
```

Note if you see an error about max_map_count then you need to increase that number with the following command:

```
sudo sysctl -w vm.max_map_count=262144
```

### 3.4 Populating your local database

The `ormconfig.json` in `packages/server/` is configured to point to a local postgres `scout` database. So we will need to create this database locally. First, start your postgres client:

```
psql postgres
```

Then, run the following commands inside it:

```
CREATE DATABASE scout;
CREATE USER postgres;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
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

If you see a message that says `Schema syncronization finished successfully.` then it means you're good to go. Now that the tables are created, you need to populate them with data.

We currently don't have a script you can run to populate the database. The official way is to start up the server with a few environment variable overrides to tell the server to populate the database on startup. You will need to start up the API server with the `PORTAL_OVERRIDE_LIST` and `UPDATE_ON_BOOT` environment variables set as follows:

```
PORTAL_OVERRIDE_LIST=data.cityofnewyork.us,data.cityofchicago.org,data.nashville.gov UPDATE_ON_BOOT=true yarn start
```

This might take a while. It will populate postgres and elasticsearch with information from all the provided portals. In the command above, we are only populating with three portals to keep things from taking too long.

When you see the following message:

> Done updating all data

Then it means the data refresh is done. You should quit the server now (ctrl+C to quit). Next time you start the server you can just use `yarn start` as normal, without the `UPDATE_ON_BOOT` environment variable.

### 3.5 Environment variables

Your database should now be seeded with some initial data. Now, you need to set up your environment variables with the necessary API keys and configurations for the Scout app to run.

Add the following to your `.zshrc` or `.bash_profile` (depending on which shell you are running). If you are on Windows, you will need to add these as environment variables on your PowerShell, or whichever shell you use.

```bash
export SCOUT_AZURE_CLIENT_ID='===REPLACE_ME==='
export SCOUT_GITHUB_CLIENT_ID='===REPLACE_ME==='

export REACT_APP_SCOUT_API_URI='http://localhost:5000/graphql'
export REACT_APP_SCOUT_CLIENT_URI='http://localhost:3000'
export REACT_APP_SCOUT_GITHUB_CLIENT_ID=$SCOUT_GITHUB_CLIENT_ID
export REACT_APP_SCOUT_AZURE_APP_CLIENT_ID=$SCOUT_AZURE_CLIENT_ID

# should be of the form 'my_azure_team_name.b2clogin.com'
export REACT_APP_SCOUT_AZURE_AUTHORITIES='===REPLACE_ME==='

# should be of the form 'https://my_azure_team_name.b2clogin.com/my_azure_team_name.onmicrosoft.com/my_B2C_auth_policy_name'
export REACT_APP_SCOUT_AZURE_FULL_AUTHORITY_URL='===REPLACE_ME==='

# should be of the form 'https://my_azure_team_name.onmicrosoft.com/my-api/MyApi.API'
export REACT_APP_SCOUT_AZURE_B2C_SCOPES='===REPLACE_ME==='

export SCOUT_SERVER_GITHUB_CLIENT_ID=$SCOUT_GITHUB_CLIENT_ID
export SCOUT_SERVER_GITHUB_CLIENT_SECRET='===REPLACE_ME==='
export SCOUT_SERVER_AZURE_APP_CLIENT_ID=$SCOUT_AZURE_CLIENT_ID
export SCOUT_SERVER_AZURE_B2C_AUTH_POLICY_NAME='===REPLACE_ME==='

# should be of the form 'https://my_azure_team_name.b2clogin.com/my_azure_team_name.onmicrosoft.com/v2.0/.well-known/openid-configuration'
export SCOUT_SERVER_AZURE_B2C_IDENTITY_METADATA_URI='===REPLACE_ME==='
```

Replace all variables that say `===REPLACE_ME===` with their appropriate values. You will need to set up a few things first to get the necessary keys.

#### 3.5.1 GitHub configuration

We use GitHub authentication for automated code searches to display helpful resources for datasets.

To get a GitHub Client ID and GitHub Client Secret you should [register a GitHub application](https://github.com/settings/applications/new).

#### 3.5.2 Azure AD B2C configuration

Scout uses Azure AD B2C for authentication. This is more complicated to set up.

1. [Register an Azure AD B2C tenant](https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant).
2. [Register a web application](https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant) in your Azure AD B2C tenant.
3. [Add a web API](https://docs.microsoft.com/en-us/azure/active-directory-b2c/add-web-api-application) so Azure can accept and respond to requests of client applications that present an access token.
4. [Add any identity providers you want](https://docs.microsoft.com/en-us/azure/active-directory-b2c/add-identity-provider) if you want to allow social media logins, such as through Facebook or Google.
5. [Set up a sign-up and sign-in policy for Azure AD B2C](https://docs.microsoft.com/en-us/azure/active-directory-b2c/add-sign-up-and-sign-in-policy) so that the necessary authentication flows can be enabled.

Once these are all set up you can update the necessary Azure environment variables with your keys and URIs.

**Remember to run `source ~/.zshrc` or `source ~/.bash_profile` to reload your environment variables after you've changed them.**

### 3.6 Running the API server

If your server is running, stop the server (use Ctrl+C to end the server process) so it can pick up your newly set up environment variables.

The API server uses [NestJS](https://nestjs.com/) and runs on `https://localhost:5000`. To start the API server:

```
cd packages/server
yarn start
```

Note that we didn't need the `PORTAL_OVERRIDE_LIST` or `UPDATE_ON_BOOT` environment variables anymore. Those were only necessary for populating the database. You shouldn't need them again.

### 3.7 Running the frontend server

The frontend is built in [React](https://reactjs.org/) and is bundled together using [Create React App](https://create-react-app.dev/). It runs on `https://localhost:3000` by default. To start the frontend server:

```
cd packages/frontend
yarn start
```

Then go to `https://localhost:3000` to view the application. You're all set up now!

## 4. Troubleshooting

### 4.1 Error when running `yarn sync-schema`: `client password must be a string`

The `packages/server/ormconfig.json` config uses an empty password. If you installed postgres through Homebrew then by default the postgres user is configured to not required a password. If you installed postgres through a different method, the password should be whichever you used when installing the database.

Set your postgres user's password in `packages/server/ormconfig.json`. **Make sure to not commit this password back.**

If you change your postgres user to not require a password or a blank password then you can leave `ormconfig.json` as is.

### 4.2 `TypeError: JwtStrategy requires a secret or key`

Make sure you've set up your [environment variables](#35-environment-variables) correctly.

### 4.3 The server is not recognizing the environment variables

Remember to reload your environment variables after you've changed them. You can do this by just opening a new terminal window. Alternatively, run `source ~/.zshrc` or `source ~/.bash_profile` (depending on your shell) to reload your environment variables after you've changed them.

### 4.4 I cannot connect to Postgres.

Make sure your postgres server is running. If you just installed Postgres or just rebooted your computer, then it's likely your Postgres server is not running yet.

```
pg_ctl -D /usr/local/var/postgres start
```

If this command doesn't work then you should replace `/usr/local/var/postgres` with the path to your Postgres data directory. If you installed Postgres through homebrew then it might be in `/opt/homebrew/var/postgres` (you can run `brew info postgres` to find out where the data directory is).
