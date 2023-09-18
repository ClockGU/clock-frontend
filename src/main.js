import VueMeta from "vue-meta";
import VueMatomo from "vue-matomo";

import i18n from "./plugins/i18n";
import router from "./router";
import store from "./store";
import PortalVue from "portal-vue";
import ApiService from "@/services/api";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import BaseLayout from "@/layouts/BaseLayout";
import Link from "@/components/base/Link";
import Placeholder from "@/components/Placeholder";
import "@/assets/main.scss";

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

import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({
  components,
  directives,
})

let Vue = createApp(App)

Vue.use(vuetify)
Vue.use(VueMeta);
Vue.use(PortalVue);
Vue.config.productionTip = false;

if (isProduction) {
  // Matomo
  Vue.use(VueMatomo, {
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
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
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

Vue.component("BaseLayout", BaseLayout);
Vue.component("BaseLink", Link);
Vue.component("Placeholder", Placeholder);

Vue.mount("#app");
