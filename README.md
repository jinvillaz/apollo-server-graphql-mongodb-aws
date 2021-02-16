# Backend technical test

## Installation

### Global Dev dependencies

```sh
nodejs 14.15.4
npm install -g yarn
```

### Install dependencies

```sh
yarn
```

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
docker build -t backendluna .
```

For test the image

```sh
docker run --name backendluna -p 5050:5050 -d backendluna
curl -i localhost:5050
docker stop backendluna
```
