# Backend technical test

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
docker run --name lunabackend -p 4000:4000 -d lunabackend
curl -i localhost:4000
docker stop lunabackend
```

## Graphql 
There is a demo running in http://3.93.175.180:4000/graphql
