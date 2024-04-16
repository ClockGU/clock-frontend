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
import StyledLink from "@/components/base/StyledLink.vue";
import Placeholder from "@/components/Placeholder.vue";
import "@/assets/main.scss";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

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

import UndrawContentCreator from "vue-undraw/UndrawContentCreator.vue";
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
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi
    }
  },
  lang: {
    locales: { de, en },
    current: "de"
  },
  theme: {
    defaultTheme: "light",
    variations: {
      colors: ["primary"],
      darken: 4,
      lighten: 4
    },
    themes: {
      light: {
        dark: false,
        colors: {
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          primary: "#1976D2",
          secondary: "#424242",
          success: "#4CAF50",
          warning: "#FB8C00",
          footerPrimary: "#0064BAFF",
          footerSecondary: "#51B0FFFF"
        }
      },
      dark: {
        dark: true,
        colors: {
          accent: "#FF4081",
          error: "#FF5252",
          info: "#2196F3",
          primary: "#2196F3",
          secondary: "#424242",
          success: "#4CAF50",
          warning: "#FB8C00",
          footerPrimary: "#003784FF",
          footerSecondary: "#004D9FFF"
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
    domains: import.meta.env.VITE_MATOMO_DOMAINS,
    trackInteraction: (to, from) => {
      // If this is the first route visited, then always record a page visit
      if (!from) {
        return true;
      }

      // Return true if the path or hash changed, but not anything else
      return to.path !== from.path || to.hash !== from.hash;
    }
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
app.component("BaseLink", StyledLink);
// eslint-disable-next-line vue/multi-word-component-names
app.component("Placeholder", Placeholder);
app.component("UndrawContentCreator", UndrawContentCreator);
app.mount("#app");
