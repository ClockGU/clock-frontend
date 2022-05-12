import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
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

// Force reload the page when we try to reload a non-existent chunk. This should
// only happen after an update, if the previous chunk was cached by the users
// browser.
router.onError((error) => {
  if (/loading chunk \d* failed./i.test(error.message)) {
    window.location.reload();
  }
});

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
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    (record) => record.meta.onlyWhenLoggedOut
  );
  const token = store.getters["auth/accessToken"];
  const loggedIn = store.getters["auth/loggedIn"];
  const needToRequestNewAccessToken = (exp) => Date.now() >= exp * 1000;

  // // Refresh JWT token
  if (loggedIn) {
    // Grab expiry date from JWT
    const { exp } = parseJwt(token);

    // Only request new access token if the old expired
    if (needToRequestNewAccessToken(exp)) {
      try {
        await store.dispatch("auth/REFRESH_TOKEN");
      } catch (error) {
        await store.dispatch("auth/LOGOUT").catch((error) => {
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
  if (to.meta.public) {
    return next();
  }
  if (to.name === "onboarding") {
    return next();
  }
  let user = store.state.user;

  if (user.dsgvo_accepted === undefined) {
    // If route is entered manually or F5 is pressed the store is refreshed
    // Fetch user data
    const { data } = await store.dispatch("GET_USER");
    user = data;
  }
  if (!user.dsgvo_accepted) {
    if (!user.onboarding_passed) {
      return next({ name: "onboarding" });
    }
    if (to.name === "privacyagreement") {
      return next();
    }
    return next({ name: "privacyagreement" });
  }
  if (to.name === "privacyagreement") {
    return next({ name: "dashboard" });
  }
  return next();
});

export default router;
