import Vue from "vue";
import VueMeta from "vue-meta";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n";
import router from "./router";
import store from "./store";
import PortalVue from "portal-vue";
import Vuelidate from "vuelidate";
import ApiService from "@/services/api";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import BaseLayout from "@/layouts/BaseLayout";
import Link from "@/components/base/Link";
import Placeholder from "@/components/Placeholder";

import "@/assets/main.scss";

// Initialize ApiService
ApiService.init(process.env.VUE_APP_API_URL);
ApiService.mountInterceptor();

const isLoggedIn = store.getters["auth/loggedIn"];
if (isLoggedIn) {
  const accessToken = store.getters["auth/accessToken"];
  ApiService.setAccessToken(accessToken);
}

Vue.use(VueMeta);
Vue.use(PortalVue);
Vue.use(Vuelidate);
Vue.config.productionTip = false;

// Setup sentry error tracking in production
const isProduction = process.env.NODE_ENV === "production";
export const debugLogger = isProduction ? false : true;
if (isProduction) {
  // Here goes the DSN
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
    environment: process.env.VUE_APP_ENV,
    beforeSend(event) {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception) {
        Sentry.showReportDialog({ eventId: event.event_id });
      }
      return event;
    }
  });
}

Vue.component("base-layout", BaseLayout);
Vue.component("base-link", Link);
Vue.component("placeholder", Placeholder);

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
