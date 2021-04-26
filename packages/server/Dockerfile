FROM ubuntu AS builder

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apt-get -y update && apt-get -y install curl

RUN curl -fsSL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -yq nodejs build-essential

# fix npm - not the latest version installed by apt-get
RUN npm install -g yarn
COPY . .
RUN yarn install

EXPOSE 5000
RUN yarn global add @nestjs/cli
RUN yarn build

# need this to force the native module of tfjs to build
RUN yarn add @tensorflow/tfjs-node --force
RUN yarn run typeorm schema:sync

CMD ["node", "dist/main"]

