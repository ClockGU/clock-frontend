import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import PortalVue from "portal-vue";
import Vuelidate from "vuelidate";
import { VueMaskDirective } from "v-mask";
import ApiService from "@/services/api.service";
import TokenService from "@/services/storage.service";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

ApiService.init(process.env.VUE_APP_API_URL);

// If token exists set header
if (TokenService.getToken()) {
  ApiService.setHeader();
  ApiService.mount401Interceptor();
}

Vue.use(PortalVue);
Vue.use(Vuelidate);

Vue.directive("mask", VueMaskDirective);

Vue.config.productionTip = false;

// Setup sentry error tracking in production
if (process.env.NODE_ENV === "production") {
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
