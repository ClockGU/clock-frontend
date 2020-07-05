import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import { getContractWithLastActivity, getNextContractParams } from "@/utils";
import { parseJwt } from "@/utils/jwt";
import { log } from "@/utils/log";
import { routes } from "./routes";

Vue.use(Router);

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
  routes: routes
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
  const needToRequestNewAccessToken = exp => Date.now() >= exp * 1000;

  // // Refresh JWT token
  if (loggedIn) {
    // Grab expiry date from JWT
    const { exp } = parseJwt(token);

    // Only request new access token if the old expired
    if (needToRequestNewAccessToken(exp)) {
      try {
        await store.dispatch("auth/REFRESH_TOKEN");
      } catch (error) {
        await store.dispatch("auth/LOGOUT").catch(error => {
          log("Experienced error while logging out in router: ", error);
        });
        return next({ name: "home" });
      }
    }
  }

  if (!isPublic && !loggedIn) {
    return next({ name: "home" });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next({ name: "dashboard" });
  }

  return next();
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.public) return next();

  if (to.query.poll !== undefined && to.query.poll === false) {
    return next();
  }

  try {
    // eslint-disable-next-line no-unused-vars
    const [shifts, contracts, reports] = await Promise.all([
      store.dispatch("shift/queryShifts"),
      store.dispatch("contract/queryContracts"),
      store.dispatch("report/list")
    ]);

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
      "calendar",
      "reporting",
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
  } catch (error) {
    log(error);
    return;
  }
});

export default router;
