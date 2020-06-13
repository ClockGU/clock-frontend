import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import { getContractWithLastActivity, getNextContractParams } from "@/utils";

Vue.use(Router);

const Home = () => import("@/views/Home");
const ViewLogin = () => import("@/views/ViewLogin");
const ViewCalendar = () => import("@/views/ViewCalendar.vue");
const ViewShiftList = () => import("@/views/ViewShiftList");
const ViewContractForm = () => import("@/views/ViewContractForm");
const ViewContractList = () => import("@/views/ViewContractList");
const ViewReportList = () => import("@/views/ViewReportList");
const ViewHelp = () => import("@/views/ViewHelp");
const Settings = () => import("@/views/Settings");
const ViewDebug = () => import("@/views/ViewDebug");
const Landing = () => import("@/views/Landing");
const Imprint = () => import("@/views/Imprint");
const Privacy = () => import("@/views/Privacy");
const Dashboard = () => import("@/components/Dashboard");
const LoggingIn = () => import("@/views/LoggingIn");
const Onboarding = () => import("@/views/Onboarding");
const NotFound = () => import("@/views/NotFound");

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }

    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: "*",
      redirect: { name: "404" }
    },
    {
      path: "/",
      component: Home,
      children: [
        {
          path: "/404",
          name: "404",
          component: NotFound,
          meta: { public: true }
        },
        {
          path: "/",
          name: "home",
          component: Landing,
          meta: { public: true, onlyWhenLoggedOut: true }
        },
        { path: "/onboarding", name: "onboarding", component: Onboarding },
        {
          path: "/impressum",
          name: "imprint",
          component: Imprint,
          meta: { public: true }
        },
        {
          path: "/datenschutz",
          name: "privacy",
          component: Privacy,
          meta: { public: true }
        },
        {
          path: "/logging-in",
          name: "loggingIn",
          component: LoggingIn,
          meta: { public: true, onlyWhenLoggedOut: true }
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
          path: "/dashboard/:contract?",
          name: "dashboard",
          component: Dashboard
        },
        {
          path: "/:type/:year/:month/:day/:contract?",
          name: "calendar",
          component: ViewCalendar,
          props: true
        },
        {
          path: "/shifts/:contract?",
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
          path: "/reports/:contract?",
          name: "reportList",
          component: ViewReportList
        },
        {
          path: "/settings",
          name: "settings",
          component: Settings
        },
        {
          path: "/debug/:contract?",
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
  if (to.meta.public) return next();

  const shifts = await store.dispatch("shift/queryShifts");
  const contracts = await store.dispatch("contract/queryContracts");

  // If the user has no contracts, push them to onboarding
  if (store.state.contract.contracts.length < 1) {
    // Do not forward to onboarding, while forwarding to onboarding
    // Removing the next line leads to an infinite loop.
    if (to.name === "onboarding") return next();

    return next({ name: "onboarding" });
  }

  const contractRoutes = [
    "dashboard",
    "shiftList",
    "reportList",
    "calendar",
    "debug"
  ];
  const contractMatch = contracts.find(
    contract => contract.uuid === to.params.contract
  );
  // Redirect to 404 page we are looking for a contract that does not exist
  if (
    to.params.contract !== undefined &&
    contractRoutes.includes(to.name) &&
    !contractMatch
  ) {
    return next({ name: "404" });
  }

  // If we match a route that requires a contrat to be set
  // but the user did not set one, we get the contract with
  // the latest activity
  if (contractRoutes.includes(to.name) && to.params.contract === undefined) {
    const uuid = getContractWithLastActivity({ shifts, contracts });
    return next(getNextContractParams(to, uuid));
  }

  next();
});

router.beforeEach(async (to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    record => record.meta.onlyWhenLoggedOut
  );
  // const token = store.getters["auth/accessToken"];
  const loggedIn = store.getters["auth/loggedIn"];
  // const needToRequestNewAccessToken = exp => Date.now >= exp * 1000;

  // // Refresh JWT token
  // if (loggedIn) {
  //   // Grab expiry date from JWT
  //   const { exp } = parseJwt(token);

  //   // Only request new access token if the old expired
  //   if (needToRequestNewAccessToken(exp)) {
  //     await store.dispatch("auth/REFRESH_TOKEN");
  //   }
  // }

  // if (
  //   loggedIn &&
  //   store.state.selectedContract === null &&
  //   to.name !== "contractSelect" &&
  //   to.name !== "createContract" &&
  //   to.name !== "help" &&
  //   to.name !== "changePassword"
  // ) {
  //   return next({
  //     name: "contractSelect"
  //   });
  // }

  if (!isPublic && !loggedIn) {
    store.dispatch("unsetContract");
    return next({
      path: "/"
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next({ name: "dashboard" });
  }

  return next();
});

export default router;
