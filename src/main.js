import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import PortalVue from "portal-vue";
import Vuelidate from "vuelidate";
import ApiService from "@/services/api";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import BaseLayout from "@/layouts/BaseLayout";
import TheFAB from "@/components/TheFAB";

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
Vue.config.productionTip = false;

// const ignoreWarnMessage =
//   "The .native modifier for v-on is only valid on components but it was used on <div>.";
// Vue.config.warnHandler = function(msg, vm, trace) {
//   // `trace` is the component hierarchy trace
//   if (msg === ignoreWarnMessage) {
//     msg = null;
//     vm = null;
//     trace = null;
//   }

//   return msg, vm, trace;
// };

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
Vue.component("the-fab", TheFAB);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
