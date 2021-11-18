FROM node:16 AS base

WORKDIR /srv/frontend

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

FROM base AS development

# Empty

FROM base AS build

RUN yarn run build

FROM amazon/aws-cli as production

COPY --from=build /srv/frontend/build/ /aws/
