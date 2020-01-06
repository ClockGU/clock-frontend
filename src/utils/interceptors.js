import store from "@/store";
import { log } from "@/utils/log";

const errorProperties = ["detail", "non_field_errors"];

const ignoreClockedShiftNotFound = function(error) {
  return (
    error.config.url.includes("clockedinshifts") &&
    error.response.status === 404 &&
    error.config.method !== "delete"
  );
};

const sessionExpiredSnack = function() {
  store.dispatch("snackbar/setSnack", {
    snack: "Your session has expired.",
    timeout: 10000,
    color: "warning"
  });
};

export const handleApiError = function(error) {
  log("handleApiError called:", error);

  return {};
};

export const handleLogout = function(error) {
  log("handleLogout called:", error);

  store.dispatch("auth/logout");
  store.dispatch("unsetContract");
  sessionExpiredSnack();

  return Promise.reject(error);
};

export const handleNetworkError = function(error) {
  log("handleNetworkError called:", error);

  store.dispatch("snackbar/setSnack", {
    snack: "We cannot phone home. Please try again later.",
    timeout: 0,
    color: "error"
  });

  return Promise.reject(error);
};

export const handleGenericError = function(error) {
  if (ignoreClockedShiftNotFound(error)) {
    log("ignoring clockedShiftNotFound");

    return Promise.reject(error);
  }

  log("handleGenericError:", error);

  const { data } = error.response;
  let message = null;
  for (let property of errorProperties) {
    if (data[property] === undefined) {
      continue;
    }
    message = data[property];

    // The error is of type "non_field_errors" and returns a list.
    // Join all separate messages into one long message.
    if (Array.isArray(message)) {
      message = message.join(" ");
    }
  }
  message = message === null ? data : message;

  store.dispatch("snackbar/setSnack", {
    snack: message,
    timeout: 5000,
    color: "error"
  });

  return Promise.reject(error);
};

export const handleTokenRefresh = async function(error, requestFn) {
  await store
    .dispatch("auth/refreshToken")
    .then(response => {
      const { accessToken } = response;

      const { config: originalRequest } = error;
      // Set new access token
      originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

      // Retry the request
      return requestFn({
        ...originalRequest,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).catch(error => {
        log("requestFn rejected");
        return Promise.reject(error);
      });
    })
    .catch(error => {
      log("handleTokenRefresh rejected");
      // Refresh has failed - reject the original request
      // and logout user.
      // If we are retrieving a clockedshift not found error, do nothing.
      if (!ignoreClockedShiftNotFound(error)) {
        handleLogout();
      }

      return Promise.reject(error);
    });
};
