import store from "@/store";

const errorProperties = ["detail"];

const ignoreClockedShiftNotFound = function(error) {
  return (
    error.config.url.includes("clockedinshifts") &&
    error.response.status === 404
  );
};

const sessionExpiredSnack = function() {
  store.dispatch("snackbar/setSnack", {
    snack: "Your session has expired.",
    timeout: 10000,
    color: "warning"
  });
};

export const handleLogout = function() {
  store.dispatch("auth/logout");
  store.dispatch("unsetContract");
  sessionExpiredSnack();
};

export const handleNetworkError = function() {
  store.dispatch("snackbar/setSnack", {
    snack: "We cannot phone home. Please try again later.",
    timeout: 0,
    color: "error"
  });
};

export const handleGenericError = function(error) {
  if (ignoreClockedShiftNotFound(error)) {
    return;
  }

  const { data } = error.response;
  let message = null;
  for (let property of errorProperties) {
    if (data[property] === undefined) {
      continue;
    }
    message = data[property];
  }
  message = message === null ? data : message;

  store.dispatch("snackbar/setSnack", {
    snack: message,
    timeout: 5000,
    color: "error"
  });
};

export const handleTokenRefresh = async function(error, customRequest) {
  try {
    // Refresh the access token
    const accessToken = await store.dispatch("auth/refreshToken");

    const { config: originalRequest } = error;
    // Set new access token
    originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

    // Retry the request
    return customRequest({
      ...originalRequest,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    });
  } catch (e) {
    // Refresh has failed - reject the original request
    // and logout user.
    sessionExpiredSnack();

    return Promise.reject();
  }
};
