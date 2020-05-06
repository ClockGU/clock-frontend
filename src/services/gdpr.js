import ApiService from "@/services/api";

const BASE_URL = "/gdpr/";

const GDPRService = {
  get: async function() {
    const requestData = {
      method: "get",
      url: BASE_URL,
      responseType: "blob"
    };
    return new Promise((resolve, reject) => {
      return ApiService.customRequest(requestData)
        .then(response => {
          return resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default GDPRService;
