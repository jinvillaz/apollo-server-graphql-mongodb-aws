# Prepare environment
FROM node:12-alpine AS BUILD_IMAGE

# install dependencies of system and remove from cache
RUN apk update && apk add bash curl && rm -rf /var/cache/apk/*

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /usr/src/app

COPY package.json ./

# install dependencies
RUN yarn

# copy all files
COPY . .

# Validate the code
#RUN yarn run lint
#RUN yarn run test
#RUN yarn run coverage

# build application
RUN yarn run build

# remove development dependencies
RUN npm prune --production

# node-prune removing unnecessary files from the node_modules
RUN /usr/local/bin/node-prune

# build application react
RUN cd react-app && yarn && yarn build

# remove unused dependencies manually
# RUN rm -rf node_modules/rxjs/src/

# final result
FROM node:12-alpine

WORKDIR /usr/src/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/react-app/build ./dist/public
COPY --from=BUILD_IMAGE /usr/src/app/package.json .
RUN mkdir /usr/src/app/uploads

# Sets Arguments by default
ARG APP_VERSION=unknown
ARG RELEASE_DATE=unknown
ARG AUTHOR=unknown

LABEL release-author=$AUTHOR \
      release-date=$RELEASE_DATE \
      release-version=$APP_VERSION

# add permision to node user
RUN chown -R node:node /usr/src/app

# change to user node
USER node

EXPOSE 4000

CMD [ "yarn", "run", "starProd" ]
