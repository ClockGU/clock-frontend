import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import PortalVue from "portal-vue";
import Vuelidate from "vuelidate";
import { VueMaskDirective } from "v-mask";
import ApiService from "@/services/api";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

import "@/assets/main.scss";

// Initialize ApiService
ApiService.init(process.env.VUE_APP_API_URL);
ApiService.mountInterceptor();

const isLoggedIn = store.getters["auth/loggedIn"];
if (isLoggedIn) {
  const accessToken = store.getters["auth/accessToken"];
  ApiService.setHeader(accessToken);
}

Vue.use(PortalVue);
Vue.use(Vuelidate);
Vue.directive("mask", VueMaskDirective);
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

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
