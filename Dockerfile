FROM node:7

WORKDIR /home/node

# needed for killall command
# current workaground for stoping all servers
# in CI context (killall node ruby)
RUN apt-get update -qq \
    && apt-get install -y psmisc

COPY dist/ /home/node/dist
COPY package.json /home/node

RUN npm install \
  && npm link
