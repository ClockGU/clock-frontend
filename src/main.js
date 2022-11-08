import Vue from "vue";
import VueMeta from "vue-meta";
import VueMatomo from "vue-matomo";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
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
import VueCompositionAPI from "@vue/composition-api";
import "@/assets/main.scss";

import { log } from "@/utils/log";

// Initialize ApiService
ApiService.init(process.env.VUE_APP_API_URL);
ApiService.mountInterceptor();

const isLoggedIn = store.getters["auth/loggedIn"];
if (isLoggedIn) {
  const accessToken = store.getters["auth/accessToken"];
  ApiService.setAccessToken(accessToken);
}

const isProduction = process.env.NODE_ENV === "production";

Vue.use(VueCompositionAPI);
Vue.use(VueMeta);
Vue.use(PortalVue);
Vue.config.productionTip = false;

export const debugLogger = isProduction ? false : true;
if (isProduction) {
  // Matomo
  Vue.use(VueMatomo, {
    host: process.env.VUE_APP_MATOMO_URL,
    siteId: process.env.VUE_APP_MATOMO_SITE_ID,
    router: router,
    requireConsent: false,
    enableHeartBeatTimer: true,
    disableCookies: true,
    debug: !isProduction,
    domains: process.env.VUE_APP_MATOMO_DOMAINS
  });

  // Setup sentry error tracking in production
  // Here goes the DSN
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
    environment: process.env.VUE_APP_ENV,
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

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount("#app");
