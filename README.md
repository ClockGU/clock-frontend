# Installation

This project uses [`yarn`](https://github.com/yarnpkg/yarn) as package manager. To install all dependencies, run the following command:

```
yarn install
```

## Configuration

You will need to configure environment variables to run the web app. We must differentiate between two cases: (i) local user accounts and (ii) OAuth user accounts. In both cases you need to create a `.env.local` file in the root of this project.

In addition to this configuration, you will need to run [`clock-backend`](https://github.com/ClockGU/clock-backend/pulls) locally.

### Local user accounts

In this mode, the app allows you to login using `LoginForm.vue` at `/login`. This uses local user accounts that can be set up in the admin interface of the [`clock-backend`](https://github.com/ClockGU/clock-backend/pulls) Django project.

The following file shows a working example for local user accounts:

```bash
VUE_APP_API_URL=http://localhost:8000
VUE_APP_PUBLIC_URL=http://localhost:8080
VUE_APP_ALLOWED_HOST=localhost
VUE_APP_I18N_LOCALE=de
VUE_APP_I18N_FALLBACK_LOCALE=en
VUE_APP_MATOMO_URL=https://piwik.rz.uni-frankfurt.de/piwik/
VUE_APP_MATOMO_SIDE_ID=117
VUE_APP_MATOMO_DOMAINS=*.uni-frankfurt.de
```

### OAuth user accounts

This set up requires a valid Goethe University Frankfurt HRZ account. The main login functionality of Clock will redirect to their OAuth flow and exchange all tokens with the Django backend. In addition, you will need to run a reverse proxy to put the local app behind a `https://*.clock.uni-frankfurt.de` domain. This will simulate the production environment, because the current OAuth flow only redirects to whitelisted domains.  Use the following `.env.local` contents:

```bash
VUE_APP_API_URL=http://localhost:8000
VUE_APP_PUBLIC_URL=https://preview.clock.uni-frankfurt.de
VUE_APP_ALLOWED_HOST=preview.clock.uni-frankfurt.de
VUE_APP_I18N_LOCALE=de
VUE_APP_I18N_FALLBACK_LOCALE=en
VUE_APP_MATOMO_URL=https://piwik.rz.uni-frankfurt.de/piwik/
VUE_APP_MATOMO_SIDE_ID=117
VUE_APP_MATOMO_DOMAINS=*.uni-frankfurt.de
```

#### Reverse proxy

For the reverse proxy you need to install [`caddy`](https://github.com/caddyserver/caddy) and create the following file:

```bash
preview.clock.uni-frankfurt.de {
  tls _wildcard.clock.uni-frankfurt.de.pem _wildcard.clock.uni-frankfurt.de-key.pem
  reverse_proxy localhost:8080 {
    header_up Host                "localhost"
    header_up X-Real-IP           {remote}
    header_up X-Forwarded-Host    "localhost"
    header_up X-Forwarded-Server  "localhost"
    header_up X-Forwarded-Port    {port}
    header_up X-Forwarded-For     {remote}
    header_up X-Forwarded-Proto   {scheme}
    header_up Access-Control-Allow-Origin "*"
    header_down Access-Control-Allow-Origin "*"
  }
}
```

#### SSL certificates

The two files `_wildcard.clock.uni-frankfurt.de.pem` and `_wildcard.clock.uni-frankfurt.de-key.pem` were generated using [`mkcert`](https://github.com/FiloSottile/mkcert) for the `*.clock.uni-frankfurt.de` subdomain wildcard. This software makes it easy to generate SSL certificates for local usage.

#### Redirecting the domain

Lastly, you need to redirect `preview.clock.uni-frankfurt.de` to your `127.0.0.1`. Refer to a search engine on how to do this on your operating system. On Linux and macOS you will need to modify `/etc/hosts`.

# Development

When you have configured the app as described above you can use `yarn` to start the development server.

```
yarn run serve
```

# Testing

You can use `yarn` to run unit and end-to-end tests:

```bash
# Unit tests
yarn run test:unit

# End-to-end tests
yarn run test:e2e
```
