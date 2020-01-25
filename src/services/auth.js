import ApiService from "@/services/api";

const AuthService = {
  /**
   * Login using the provided credentials.
   */
  login: (email, password) => {
    return ApiService.post("/auth/jwt/create/", { email, password });
  },

  /**
   * Change current to the new password.
   **/
  changePassword: (current_password, new_password) => {
    return ApiService.post("/auth/users/set_password/", {
      current_password,
      new_password
    });
  },

  /**
   * Retrieve data about logged in user from API.
   */
  getUser: async function() {
    const url = "/auth/users/me/";
    return ApiService.get(url);
  },

  /**
   * Refresh the access token.
   **/
  refreshToken: refreshToken => {
    return ApiService.post("/auth/jwt/refresh", { refresh: refreshToken });
  },

  /**
   * Logout the current user by removing the token from storage.
   *
   * Will also remove `Authorization Bearer <token>` header from future requests
   * and unmount the interceptor.
   **/
  logout() {
    ApiService.removeHeader();
    ApiService.unmountInterceptor();
  }
};

export default AuthService;
