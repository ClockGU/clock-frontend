import ApiService from "@/services/api.service";
import TokenService from "@/services/storage.service";
import store from "@/store";

class AuthenticationError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
  }
}

const UserService = {
  /**
   * Login the user and store the access token to TokenService.
   *
   * @returns access_token
   * @throws AuthenticationError
   **/
  login: async function(email, password) {
    const requestData = {
      method: "post",
      url: "/auth/jwt/create/",
      data: {
        email: email,
        password: password
      }
    };

    return new Promise((resolve, reject) => {
      return ApiService.customRequest(requestData)
        .then(response => {
          TokenService.saveToken(response.data.access);
          TokenService.saveRefreshToken(response.data.refresh);
          ApiService.setHeader();

          ApiService.mount401Interceptor();

          resolve(response.data.access);
        })
        .catch(error => {
          reject(
            new AuthenticationError(
              error.response.status,
              error.response.data.non_field_errors[0]
            )
          );
        });
    });
  },

  getUser: async function() {
    const requestData = {
      method: "get",
      url: "/auth/users/me/"
    };

    return new Promise((resolve, reject) => {
      return ApiService.customRequest(requestData)
        .then(response => {
          store.dispatch("setUser", response.data);

          resolve();
        })
        .catch(error => {
          reject(
            new AuthenticationError(
              error.response.status,
              error.response.data.non_field_errors[0]
            )
          );
        });
    });
  },

  /**
   * Refresh the access token.
   **/
  refreshToken: async function() {
    const refreshToken = TokenService.getRefreshToken();

    const requestData = {
      method: "post",
      url: "/auth/jwt/refresh",
      data: {
        refresh: refreshToken
      }
    };

    return new Promise((resolve, reject) => {
      return ApiService.customRequest(requestData)
        .then(response => {
          TokenService.saveToken(response.data.access);
          // Update the header in ApiService
          ApiService.setHeader();

          resolve(response.data.access);
        })
        .catch(error => {
          reject(
            new AuthenticationError(
              error.response.status,
              error.response.data.non_field_errors[0]
            )
          );
        });
    });
  },

  /**
   * Logout the current user by removing the token from storage.
   *
   * Will also remove `Authorization Bearer <token>` header from future requests.
   **/
  logout() {
    // Remove the token and remove Authorization header from Api Service as well
    TokenService.removeToken();
    TokenService.removeRefreshToken();
    ApiService.removeHeader();

    // NOTE: Again, we'll cover the 401 Interceptor a bit later.
    ApiService.unmount401Interceptor();
  }
};

export default UserService;

export { UserService, AuthenticationError };
