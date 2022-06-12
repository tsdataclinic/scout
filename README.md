# Scout

![Screenshot of Scout](https://scout.tsdataclinic.com/screenshot.png)

Scout is a data discovery tool for open data portals. It is an open source product that eases the search and curation of thematically related and joinable datasets to broaden the application of open data to uncover new insights. Scout is designed to help surface datasets in open data portals that might have escaped your attention before.

At the moment, Scout only provides access to open data portals made accessible via the [Socrata API](https://socratadiscovery.docs.apiary.io/#).

[Try it out here](https://scout.tsdataclinic.com).

## Table of Contents

1. [Contributing](#1-contributing)
2. [Developing](#2-developing)
3. [Troubleshooting](#3-troubleshooting)
4. [User guide](#4-user-guide)
5. [Roadmap](#5-roadmap)

## 1. Contributing

We love all contributions, be it a bug report, feature request, or change to the codebase. Check out our [contributing](CONTRIBUTING.md) guidelines for all the ways you can contribute to the project.

## 2. Developing

If you want to help with the development of Scout, you need to be able to run the code locally.

### 2.1 Prerequisites

Make sure you have the following installed:

- Node
- Yarn
- Postgres (on MacOS we recommend installing with [Homebrew](https://brew.sh/) rather than a manual download)
- Docker

### 2.2 Installing requirements

To get started clone the repo and install requirements:

```bash
git clone https://github.com/tsdataclinic/scout.git
cd scout
yarn install
```

### 2.3 Environment variables

You need to set up your environment variables with the necessary API keys and configurations for the Scout app to run.

Add the following to your `~/.zshrc` or `~/.bash_profile` (depending on which shell you are running). If you are on Windows, you will need to add these as environment variables on your PowerShell, or whichever shell you use.

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

#### 2.3.1 GitHub configuration

We use GitHub authentication for automated code searches to display helpful resources for datasets.

To get a GitHub Client ID and GitHub Client Secret you should [register a GitHub application](https://github.com/settings/applications/new).

#### 2.3.2 Azure AD B2C configuration

Scout uses Azure AD B2C for authentication. You will need to set up an Azure AD B2C tenant to generate the API keys you need to support Scout authentication. This is more complicated to set up.

1. [Register an Azure AD B2C tenant](https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant).
2. [Register a web application](https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant) in your Azure AD B2C tenant.
3. [Add a web API](https://docs.microsoft.com/en-us/azure/active-directory-b2c/add-web-api-application) so Azure can accept and respond to requests of client applications that present an access token.
4. [Add any identity providers you want](https://docs.microsoft.com/en-us/azure/active-directory-b2c/add-identity-provider) if you want to allow social media logins, such as through Facebook or Google.
5. [Set up a sign-up and sign-in policy for Azure AD B2C](https://docs.microsoft.com/en-us/azure/active-directory-b2c/add-sign-up-and-sign-in-policy) so that the necessary authentication flows can be enabled.

Once these are all set up you can update the necessary Azure environment variables with your keys and URIs.

**Remember to run `source ~/.zshrc` or `source ~/.bash_profile` to reload your environment variables after you've changed them.**

### 2.4 Running Elasticsearch

The search backend uses Elasticsearch. To run it locally, the easiest way to do it is with [docker-compose](https://docs.docker.com/compose/install/):

```
docker-compose -f docker-compose.yml up
```

Note if you see an error about max_map_count then you need to increase that number with the following command:

```
sudo sysctl -w vm.max_map_count=262144
```

### 2.5 Populating your local database

The `TYPEORM` variables in `packages/server/.env` are configured to point to a local postgres `scout` database. So we will need to create this database locally. First, start your postgres client:

```
psql postgres
```

Then, run the following commands inside it:

```
CREATE DATABASE scout;
CREATE USER postgres;
\c scout;
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

If you see a message that says `Schema syncronization finished successfully.` then it means you're good to go. Now that the tables are created, you need to populate them with data. To do that, run:

```
yarn seed-database-dev
```

This might take a while. It will populate postgres and elasticsearch with data from three portals (to keep things from taking too long). If you wanted to populate your database with _all_ portals, then run `yarn seed-database-full`. This is **_not_** recommended during development.

When you see the following message:

> Done updating all data

Then it means the data refresh is done.

### 2.6 Running the API server

The API server uses [NestJS](https://nestjs.com/) and runs on `https://localhost:5000`. To start the API server:

```
cd packages/server
yarn start
```

### 2.7 Running the frontend server

The frontend is built in [React](https://reactjs.org/) and is bundled together using [Create React App](https://create-react-app.dev/). It runs on `https://localhost:3000` by default. To start the frontend server:

```
cd packages/frontend
yarn start
```

Then go to `https://localhost:3000` to view the application. You're all set up now!

## 3. Troubleshooting

This is a collection of common problems that might come up during setup. If you run into a problem not listed here, please submit an issue about it so we can update this guide if necessary.

### 3.1 Error when running `yarn sync-schema`: `client password must be a string`

The `TYPEORM_PASSWORD` environment variable in `packages/server/.env` defaults to an empty password. If you installed postgres through Homebrew then postgres user is configured by default to not require a password. If you installed postgres through a different method, the password should be whichever you used when installing the database. You can resolve this problem with any of these three approaches:

1. Uninstall postgres and re-install it using homebrew: `brew install postgresql`
2. Change your current postgres configuration to not require a password, or set the password to an empty string.
3. Change the `TYPEORM_PASSWORD` in `.env` to be equal to the password you use to access your postgres (which should be whatever you used when installed the database). **If you add your password to `.env`, remember to NOT commit this password back.**

### 3.2 `TypeError: JwtStrategy requires a secret or key`

Make sure you've set up your [environment variables](#35-environment-variables) correctly.

### 3.3 The server is not recognizing the environment variables

Remember to reload your environment variables after you've changed them. You can do this by just opening a new terminal window. Alternatively, run `source ~/.zshrc` or `source ~/.bash_profile` (depending on your shell) to reload your environment variables after you've changed them.

### 3.4 I cannot connect to Postgres.

Make sure your postgres server is running. If you just installed Postgres or just rebooted your computer, then it's likely your Postgres server is not running yet.

```
pg_ctl -D /usr/local/var/postgres start
```

If this command doesn't work then you should replace `/usr/local/var/postgres` with the path to your Postgres data directory. If you installed Postgres through homebrew then it might be in `/opt/homebrew/var/postgres` (you can run `brew info postgres` to find out where the data directory is).

### 3.5 `Maximum call stack size exceeded` when starting the API or frontend server

If you see an error like this:

```
/home/runner/work/scout/scout/node_modules/react-scripts/node_modules/dotenv-expand/lib/main.js:11
      var parts = /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match)
                                                ^

RangeError: Maximum call stack size exceeded
    at RegExp.exec (<anonymous>)
    at /home/runner/work/scout/scout/node_modules/react-scripts/node_modules/dotenv-expand/lib/main.js:11:49
    at Array.reduce (<anonymous>)
    at interpolate (/home/runner/work/scout/scout/node_modules/react-scripts/node_modules/dotenv-expand/lib/main.js:10:20)
    at /home/runner/work/scout/scout/node_modules/react-scripts/node_modules/dotenv-expand/lib/main.js:26:17
    at Array.reduce (<anonymous>)
    at interpolate (/home/runner/work/scout/scout/node_modules/react-scripts/node_modules/dotenv-expand/lib/main.js:10:20)
    at /home/runner/work/scout/scout/node_modules/react-scripts/node_modules/dotenv-expand/lib/main.js:26:17
    at Array.reduce (<anonymous>)
    at interpolate (/home/runner/work/scout/scout/node_modules/react-scripts/node_modules/dotenv-expand/lib/main.js:10:20)
```

Then it is likely because you have not set up your local [environment variables](#25-environment-variables) which is causing an error when the servers try parsing the `.env` files.

## 4. User guide

**User guide coming soon.**

## 5. Roadmap

**A new roadmap is coming up soon for 2022.**
