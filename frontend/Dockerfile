FROM node:16 AS base

WORKDIR /srv/frontend

COPY package*.json yarn.lock ./

FROM base AS development

ENV NODE_ENV='development'

RUN yarn install

COPY . .

CMD yarn start

FROM base AS production

ENV NODE_ENV='production'

RUN yarn install
