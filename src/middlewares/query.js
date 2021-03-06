import store from "@/store";

export default async function queryData({ from, next }) {
  const loggedIn = store.getters["auth/loggedIn"];
  if (
    !loggedIn ||
    (from.name !== null &&
      from.name !== "login" &&
      from.name !== "contractSelect")
  ) {
    // Do nothing if we use normal router navigation.
    return next();
  }

  // In this case, we loaded the page inititally or refreshed it.
  Promise.all([
    store.dispatch("shift/queryShifts"),
    store.dispatch("contract/queryContracts")
  ])
    .then(() => {
      store.dispatch("stopLoading");
      return next();
    })
    .catch(() => {
      store.dispatch("auth/logout");
      store.dispatch("unsetContract");
      return;
    });
}
