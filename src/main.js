import { createMetaManager } from "vue-meta";
import VueMatomo from "vue-matomo";
import VueI18n from "./plugins/i18n";
import router from "./router";
import store from "./store";
import PortalVue from "portal-vue";
import ApiService from "@/services/api";
import * as Sentry from "@sentry/vue";

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
import { VTimePicker } from "vuetify/labs/VTimePicker";
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
  components: { VTimePicker, ...components },
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
    app,
    dsn: import.meta.env.VITE_GLITCHTIP_URL,
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
    integrations: [Sentry.browserTracingIntegration({ router })],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // We recommend adjusting this value in production
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 1.0,
    // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/]
  });
}

app.component("BaseLayout", BaseLayout);
app.component("BaseLink", StyledLink);
// eslint-disable-next-line vue/multi-word-component-names
app.component("Placeholder", Placeholder);

app.mount("#app");
