import ApiService from "@/services/api";

const BASE_URL = "/gdpr/";

const GDPRService = {
  get: function() {
    return ApiService.get(BASE_URL);
  }
};

export default GDPRService;
