import ApiService from "@/services/api";

const REDIRECT_URI = `${import.meta.env.VITE_PUBLIC_URL}/logging-in`;

const OAuth2Service = {
  get: function () {
    return ApiService.get(`/auth/o/authorize/?redirect_uri=${REDIRECT_URI}`);
  },
  post: function (code) {
    return ApiService.post("/auth/o/token/", { code });
  }
};

export default OAuth2Service;
