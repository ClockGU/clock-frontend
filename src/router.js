import Vue from "vue";
import Router from "vue-router";
import UserService from "@/services/user.service";
import TokenService, { parseJwt } from "@/services/storage.service";
import ViewLogin from "@/views/ViewLogin";
import ViewLogout from "@/views/ViewLogout";
import ViewCalendar from "@/views/ViewCalendar.vue";
import ViewShiftForm from "@/views/ViewShiftForm";
import ViewShiftList from "@/views/ViewShiftList";
import ViewContractForm from "@/views/ViewContractForm";
import ViewContractList from "@/views/ViewContractList";
import ViewClockInOut from "@/views/ViewClockInOut";
import store from "@/store";

Vue.use(Router);

function queryData(to, from, next) {
  if (from.name !== null && from.name !== "login") {
    // Do nothing if we use normal router navigation.
    next();
    return;
  }

  // In this case, we loaded the page inititally or refreshed it.
  Promise.all([
    store.dispatch("shift/queryShifts"),
    store.dispatch("contract/queryContracts")
  ])
    .then(() => {
      store.dispatch("stopLoading");
      next();
    })
    .catch(() => next({ path: "uhoh" }));
}

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: ViewLogin,
      meta: {
        public: true,
        onlyWhenLoggedOut: true,
        breadcrumb: null
      }
    },
    {
      path: "/logout",
      name: "logout",
      component: ViewLogout,
      meta: {
        public: false,
        onlyWhenLoggedOut: false,
        breadcrumb: null
      }
    },
    {
      path: "/",
      name: "c",
      component: ViewCalendar,
      beforeEnter: queryData,
      meta: {
        breadcrumb: null
      }
    },
    {
      path: "/:type/:year/:month/:day",
      name: "calendar",
      component: ViewCalendar,
      props: true,
      meta: {
        breadcrumb: null
      }
    },
    {
      path: "/shifts/:uuid/edit",
      name: "editShift",
      component: ViewShiftForm,
      props: true,
      beforeEnter: queryData,
      meta: {
        breadcrumb: null
      }
    },
    {
      path: "/shifts/create",
      name: "createShift",
      component: ViewShiftForm,
      beforeEnter: queryData,
      meta: {
        breadcrumb: null
      }
    },
    {
      path: "/shifts/",
      name: "shiftList",
      component: ViewShiftList,
      beforeEnter: queryData,
      meta: {
        breadcrumb: null
      }
    },
    {
      path: "/contracts/create",
      name: "createContract",
      component: ViewContractForm,
      meta: {
        breadcrumb: [
          {
            text: "Contracts",
            to: { path: "/contracts/" },
            exact: true
          },
          { text: "New contract" }
        ]
      }
    },
    {
      path: "/contracts/:uuid/edit",
      name: "editContract",
      component: ViewContractForm,
      props: true,
      beforeEnter: queryData,
      meta: {
        breadcrumb: [
          {
            text: "Contracts",
            to: { path: "/contracts/" },
            exact: true
          },
          { text: "Update contract" }
        ]
      }
    },
    {
      path: "/contracts/",
      name: "contractList",
      component: ViewContractList,
      beforeEnter: queryData,
      meta: {
        breadcrumb: null
      }
    },
    {
      path: "/select/",
      name: "contractSelect",
      component: ViewContractList,
      beforeEnter: queryData,
      meta: {
        breadcrumb: null
      }
    },
    {
      path: "/clock",
      name: "clockInOut",
      component: ViewClockInOut,
      meta: {
        breadcrumb: null
      }
    }
  ]
});

let pollingUserData = false;

router.beforeEach(async (to, from, next) => {
  const token = TokenService.getToken();
  const loggedIn = !!token;

  if (loggedIn && !!store.state.user.first_name && !pollingUserData) {
    // Get user data, if it is not set yet
    try {
      pollingUserData = true;
      await UserService.getUser();
    } catch (error) {
      store.dispatch("snackbar/setSnack", {
        snack: error,
        timeout: 0,
        color: "error"
      });
    }
  }

  // eslint-disable-next-line require-atomic-updates
  pollingUserData = false;
  next();
});

router.beforeEach(async (to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    record => record.meta.onlyWhenLoggedOut
  );
  const token = TokenService.getToken();
  const loggedIn = !!token;
  const requestNewAccessToken = exp => Date.now >= exp * 1000;

  // Refresh JWT token
  if (loggedIn) {
    // Grab expiry date from JWT
    const { exp } = parseJwt(token);

    // Only request new access token if the old expired
    if (requestNewAccessToken(exp)) await store.dispatch("auth/refreshToken");
  }

  if (
    loggedIn &&
    !store.state.selectedContract &&
    to.name !== "contractSelect"
  ) {
    return next({
      name: "contractSelect"
    });
  }

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
