# Setup stage
FROM node:18.19-alpine3.19 as build-stage
ARG REPOSITORY_URL
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_URL
ARG VUE_APP_SENTRY_DSN
ARG VUE_APP_ALLOWED_HOST
ARG VUE_APP_API_URL
ARG VUE_APP_ENV
ARG VUE_APP_PUBLIC_URL
ARG VUE_APP_MATOMO_URL
ARG VUE_APP_MATOMO_SITE_ID
ARG VUE_APP_MATOMO_DOMAINS

ENV REPOSITORY_URL=${REPOSITORY_URL} SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN} SENTRY_ORG=${SENTRY_ORG} SENTRY_PROJECT=${SENTRY_PROJECT} SENTRY_URL=${SENTRY_URL} VUE_APP_SENTRY_DSN=${VUE_APP_SENTRY_DSN} VITE_ALLOWED_HOST=${VITE_ALLOWED_HOST} VITE_API_URL=${VITE_API_URL} VITE_ENV=${VITE_ENV} VITE_PUBLIC_URL=${VITE_PUBLIC_URL} VITE_MATOMO_URL=${VITE_MATOMO_URL} VITE_MATOMO_SIDE_ID=${VITE_MATOMO_SIDE_ID} VITE_MATOMO_DOMAINS=${VITE_MATOMO_DOMAINS}

RUN addgroup -S app --gid 32769 \
    && adduser -G app --uid 32769 -h /app -D app

RUN apk update \
    && apk add bash curl git nginx python3

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY --chown=app:app . .
RUN export VUE_APP_SENTRY_RELEASE=$(git log -1 --format="%H") \
    && yarn build

USER app
COPY --chown=app:app scripts/sentry-release.sh .
RUN bash sentry-release.sh


FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/docker/dokku/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
