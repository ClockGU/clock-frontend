import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import { parseJwt } from "@/utils/jwt";

Vue.use(Router);

const Home = () => import("@/views/Home");
const ViewLogin = () => import("@/views/ViewLogin");
const ViewLogout = () => import("@/views/ViewLogout");
const ViewCalendar = () => import("@/views/ViewCalendar.vue");
const ViewShiftList = () => import("@/views/ViewShiftList");
const ViewContractForm = () => import("@/views/ViewContractForm");
const ViewContractList = () => import("@/views/ViewContractList");
const ViewReportList = () => import("@/views/ViewReportList");
const ViewChangePassword = () => import("@/views/ViewChangePassword");
const ViewHelp = () => import("@/views/ViewHelp");
const ViewDebug = () => import("@/views/ViewDebug");

const Dashboard = () => import("@/components/Dashboard");

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Home,
      children: [
        { path: "/dashboard", name: "dashboard", component: Dashboard },
        { path: "/", component: Dashboard },
        {
          path: "/changePassword",
          name: "changePassword",
          component: ViewChangePassword
        },
        {
          path: "/help",
          name: "help",
          component: ViewHelp,
          meta: {
            public: true
          }
        },
        {
          path: "/:type/:year/:month/:day",
          name: "calendar",
          component: ViewCalendar,
          props: true
        },
        {
          path: "/shifts/",
          name: "shiftList",
          component: ViewShiftList
        },
        {
          path: "/contracts/create",
          name: "createContract",
          component: ViewContractForm
        },
        {
          path: "/contracts/:uuid/edit",
          name: "editContract",
          component: ViewContractForm,
          props: true
        },
        {
          path: "/contracts/",
          name: "contractList",
          component: ViewContractList
        },
        {
          path: "/select/",
          name: "contractSelect",
          component: ViewContractList
        },
        {
          path: "/report",
          name: "reportList",
          component: ViewReportList
        },
        {
          path: "/debug",
          name: "debug",
          component: ViewDebug
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: ViewLogin,
      meta: {
        public: true,
        onlyWhenLoggedOut: true
      }
    },
    {
      path: "/logout",
      name: "logout",
      component: ViewLogout,
      meta: {
        public: false,
        onlyWhenLoggedOut: false
      }
    }
  ]
});

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Than run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

router.beforeEach(async (to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    record => record.meta.onlyWhenLoggedOut
  );
  const token = store.getters["auth/accessToken"];
  const loggedIn = store.getters["auth/loggedIn"];
  const needToRequestNewAccessToken = exp => Date.now >= exp * 1000;

  // Refresh JWT token
  if (loggedIn) {
    // Grab expiry date from JWT
    const { exp } = parseJwt(token);

    // Only request new access token if the old expired
    if (needToRequestNewAccessToken(exp)) {
      await store.dispatch("auth/REFRESH_TOKEN");
    }
  }

  if (
    loggedIn &&
    store.state.selectedContract === null &&
    to.name !== "contractSelect" &&
    to.name !== "createContract" &&
    to.name !== "help" &&
    to.name !== "changePassword"
  ) {
    return next({
      name: "contractSelect"
    });
  }

  if (!isPublic && !loggedIn) {
    store.dispatch("unsetContract");
    return next({
      path: "/login"
      // query: { redirect: to.fullPath } // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next("/");
  }

  return next();
});

export default router;
