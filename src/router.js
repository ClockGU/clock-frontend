import Vue from "vue";
import Router from "vue-router";
import CalendarView from "./views/CalendarView.vue";
import CreateShift from "./views/CreateShift";
import ContractFormView from "./views/ContractFormView";
import ShiftList from "./views/ShiftList";
import ContractList from "./views/ContractList";
import ClockInOut from "./views/ClockInOut";
import TokenService from "@/services/storage.service";
import LoginView from "@/views/LoginView";
import LogoutView from "@/views/LogoutView";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        public: true,
        onlyWhenLoggedOut: true
      }
    },
    {
      path: "/logout",
      name: "logout",
      component: LogoutView,
      meta: {
        public: false,
        onlyWhenLoggedOut: false
      }
    },
    {
      path: "/",
      name: "c",
      component: CalendarView
    },
    {
      path: "/:type/:year/:month/:day",
      name: "calendar",
      component: CalendarView,
      props: true
    },
    {
      path: "/shifts/",
      name: "shiftList",
      component: ShiftList
    },
    {
      path: "/shifts/:uuid/edit",
      name: "editShift",
      component: CreateShift,
      props: true
    },
    {
      path: "/shifts/create",
      name: "createShift",
      component: CreateShift
    },
    {
      path: "/contracts/",
      name: "contractList",
      component: ContractList
    },
    {
      path: "/contracts/create",
      name: "createContract",
      component: ContractFormView
    },
    {
      path: "/contracts/:uuid/edit",
      name: "editContract",
      component: ContractFormView,
      props: true
    },
    {
      path: "/clock",
      name: "clockInOut",
      component: ClockInOut
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    record => record.meta.onlyWhenLoggedOut
  );
  const loggedIn = !!TokenService.getToken();

  if (!isPublic && !loggedIn) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath } // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next("/");
  }

  next();
});

export default router;
