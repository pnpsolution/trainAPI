### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:8-alpine

# build tools for native dependencies
RUN apk add --update make gcc g++ python git

# graphicsmagick
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories;
RUN apk add --update graphicsmagick && rm -rf /var/cache/apk/* 

# Copy package file
COPY package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
RUN npm install -g typescript@2.5.2
RUN npm install -g pm2

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /api-app && mkdir /uploads && cp -R ./node_modules ./api-app 

WORKDIR /api-app

COPY . .

EXPOSE 9093
## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build
CMD ["pm2-runtime", "process.yml"]
