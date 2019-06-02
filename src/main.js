import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PortalVue from "portal-vue";
import Vuelidate from "vuelidate";
import ApiService from "@/services/api.service";
import TokenService from "@/services/storage.service";

ApiService.init(`http://localhost:8000`);

// If token exists set header
if (TokenService.getToken()) {
  ApiService.setHeader();
  ApiService.mount401Interceptor();
}

Vue.use(PortalVue);
Vue.use(Vuelidate);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
