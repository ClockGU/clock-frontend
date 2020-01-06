import store from "@/store";

import UserService from "@/services/user";

let toggled = false;

export default async function getUserData({ next }) {
  if (
    store.state.user.first_name === "" &&
    !store.state.backendOffline &&
    !toggled
  ) {
    toggled = true;
    try {
      await UserService.getUser();
    } catch (error) {
      store.dispatch("toggleBackend");
    }
  }

  return next();
}
