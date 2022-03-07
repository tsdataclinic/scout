FROM ubuntu AS builder

RUN mkdir /web-client
WORKDIR /web-client

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apt-get -y update && apt-get -y install curl

# Install node and python
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -yq nodejs build-essential python

# fix npm - not the latest version installed by apt-get
RUN npm install -g yarn

# copy the current frontend directory to the image's WORKDIR
COPY . .
RUN yarn install

EXPOSE 3000
RUN yarn build
RUN yarn global add serve

CMD ["serve", "-s", "build"]
