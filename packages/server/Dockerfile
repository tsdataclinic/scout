FROM ubuntu AS builder

# RUN mkdir /usr/src/app # prod
# WORKDIR /usr/src/app # prod

RUN mkdir /api-server
WORKDIR /api-server

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apt-get -y update && apt-get -y install curl

# Install node and python
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -yq nodejs build-essential python

# fix npm - not the latest version installed by apt-get
RUN npm install -g yarn

# copy the current server directory to the image's WORKDIR
COPY . .
RUN yarn install

EXPOSE 5000
RUN yarn global add @nestjs/cli
RUN yarn build
RUN yarn run typeorm schema:sync

CMD ["node", "dist/main"]
