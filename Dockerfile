# Setup stage
FROM node:22-alpine as build-stage
ARG REPOSITORY_URL
ARG VITE_GLITCHTIP_URL
ARG VITE_DEPLOY
ARG VITE_API_URL
ARG VITE_MATOMO_URL
ARG VITE_MATOMO_SITE_ID
ARG VITE_MATOMO_DOMAINS
ARG VITE_PUBLIC_URL
ENV VITE_DEPLOY=${VITE_DEPLOY} REPOSITORY_URL=${REPOSITORY_URL} VITE_GLITCHTIP_URL=${VITE_GLITCHTIP_URL} VITE_API_URL=${VITE_API_URL} VITE_MATOMO_URL=${VITE_MATOMO_URL} \
 VITE_MATOMO_SITE_ID=${VITE_MATOMO_SITE_ID} VITE_MATOMO_DOMAINS=${VITE_MATOMO_DOMAINS} VITE_PUBLIC_URL=${VITE_PUBLIC_URL}

RUN addgroup -S app --gid 32767 \
    && adduser -G app --uid 32767 -h /app -D app

RUN apk update \
    && apk add bash curl git nginx python3

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY --chown=app:app . .
USER app
RUN export VUE_APP_SENTRY_RELEASE=$(git log -1 --format="%H") \
    && yarn build

COPY --chown=app:app scripts/sentry-release.sh .
RUN bash sentry-release.sh


FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/docker/dokku/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
