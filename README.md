# Backend node.js + apollo server + graphql + mongodb + AWS notification

## Installation

### Global Dev dependencies

```sh
nodejs 14.15.4
npm install -g yarn
mongodb 5
```

### Install dependencies

```sh
yarn
```

## .env File
You need to create the .env file like .env.example

## Yarn tasks

- **yarn run build** Generates a build production dist.
- **yarn run dev** Starts the application and watches the files.
- **yarn run start** Generates a build production dist and run the server.
- **yarn run eslint** Starts the linting utility eslint.
- **yarn run test** Executes all the available test cases.
- **yarn run coverage** Executes all the available test cases and show code coverage.
- **yarn run test:auto** Executes all the available test cases watch mode.

## Build and test docker image locally

With params

```sh
APP_VERSION=test
RELEASE_DATE=$(date +"%Y/%m/%d")
AUTHOR=user
docker build -t backend --build-arg APP_VERSION=${APP_VERSION} --build-arg RELEASE_DATE=${RELEASE_DATE} --build-arg AUTHOR=${AUTHOR} .
```

Without params

```sh
docker build -t lunabackend .
```

For test the image

```sh
docker-compose up -d
```

# Default Data
In order to have default user and some products.
you need to restore data with file db.dump

```sh
docker exec -ti mongodb sh
apk add --no-cache mongodb-tools
```
exit from container mongodb
and execute the next command

```sh
docker exec -i mongodb sh -c 'mongorestore --archive' < db.dump
```

