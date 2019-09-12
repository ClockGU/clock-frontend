import Vue from "vue";
import Router from "vue-router";
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
import getUserData from "@/middlewares/user";
import queryData from "@/middlewares/query";

Vue.use(Router);

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
      meta: {
        breadcrumb: null,
        middleware: queryData
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
      meta: {
        breadcrumb: [
          {
            text: "Calendar",
            to: { path: "/" },
            exact: true
          },
          { text: "Update shift" }
        ],
        middleware: queryData
      }
    },
    {
      path: "/shifts/create",
      name: "createShift",
      component: ViewShiftForm,
      meta: {
        breadcrumb: [
          {
            text: "Calendar",
            to: { path: "/" },
            exact: true
          },
          { text: "New shift" }
        ],
        middleware: queryData
      }
    },
    {
      path: "/shifts/",
      name: "shiftList",
      component: ViewShiftList,
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
      },
      middleware: queryData
    },
    {
      path: "/contracts/:uuid/edit",
      name: "editContract",
      component: ViewContractForm,
      props: true,
      meta: {
        breadcrumb: [
          {
            text: "Contracts",
            to: { path: "/contracts/" },
            exact: true
          },
          { text: "Update contract" }
        ]
      },
      middleware: queryData
    },
    {
      path: "/contracts/",
      name: "contractList",
      component: ViewContractList,
      meta: {
        breadcrumb: null,
        middleware: queryData
      }
    },
    {
      path: "/select/",
      name: "contractSelect",
      component: ViewContractList,
      meta: {
        breadcrumb: null,
        middleware: getUserData
      }
    },
    {
      path: "/clock",
      name: "clockInOut",
      component: ViewClockInOut,
      meta: {
        breadcrumb: null,
        middleware: queryData
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
    to.name !== "contractSelect" &&
    to.name !== "createContract"
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

  return next();
});

export default router;
