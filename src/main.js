import { createMetaManager } from "vue-meta";
import VueMatomo from "vue-matomo";
import VueI18n from "./plugins/i18n";
import router from "./router";
import store from "./store";
import PortalVue from "portal-vue";
import ApiService from "@/services/api";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import BaseLayout from "@/layouts/BaseLayout.vue";
import Link from "@/components/base/Link.vue";
import Placeholder from "@/components/Placeholder.vue";
import "@/assets/main.scss";

// Vue

import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Locales
import { de, en } from "vuetify/locale";

import { log } from "@/utils/log";
const isProduction = import.meta.env.NODE_ENV === "production";
export const debugLogger = !isProduction;
// Initialize ApiService
ApiService.init(import.meta.env.VITE_API_URL);
ApiService.mountInterceptor();

const isLoggedIn = store.getters["auth/loggedIn"];
if (isLoggedIn) {
  const accessToken = store.getters["auth/accessToken"];
  ApiService.setAccessToken(accessToken);
}
const vuetify = createVuetify({
  icons: {
    iconfont: "mdiSvg"
  },
  lang: {
    locales: { de, en },
    current: "de"
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          accent: "#82B1FF",
          error: "#FF5252",
          footerPrimary: "primary darken-2",
          footerSecondary: "primary lighten-1",
          info: "#2196F3",
          primary: "#1976D2",
          secondary: "#424242",
          success: "#4CAF50",
          warning: "#FB8C00"
        }
      },
      dark: {
        dark: true,
        colors: {
          accent: "#FF4081",
          error: "#FF5252",
          footerPrimary: "primary darken-4",
          footerSecondary: "primary darken-3",
          info: "#2196F3",
          primary: "#2196F3",
          secondary: "#424242",
          success: "#4CAF50",
          warning: "#FB8C00"
        }
      }
    }
  },
  components,
  directives
});

const app = createApp(App);

app.use(router);
app.use(store);
app.use(VueI18n);
app.use(vuetify);
app.use(createMetaManager());
app.use(PortalVue);
app.config.productionTip = false;

if (isProduction) {
  // Matomo
  app.use(VueMatomo, {
    host: import.meta.env.VITE_MATOMO_URL,
    siteId: import.meta.env.VITE_MATOMO_SITE_ID,
    router: router,
    requireConsent: false,
    enableHeartBeatTimer: true,
    disableCookies: true,
    debug: !isProduction,
    domains: import.meta.env.VITE_MATOMO_DOMAINS
  });

  // Setup sentry error tracking in production
  // Here goes the DSN
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Integrations.Vue({ app, attachProps: true })],
    environment: import.meta.env.VITE_ENV,
    beforeSend(event) {
      // Check if it is an exception, and if so, log the error and redirect the
      // user to a 404 page.

      if (event.exception) {
        log(event);

        router.push({ name: "404" });
      }

      return event;
    }
  });
}

app.component("BaseLayout", BaseLayout);
app.component("BaseLink", Link);
app.component("Placeholder", Placeholder);

app.mount("#app");
