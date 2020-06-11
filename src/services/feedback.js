import ApiService from "@/services/api";

const BASE_URL = "/feedback/";

const FeedbackService = {
  post: async function(data) {
    return ApiService.post(BASE_URL, data);
  }
};

export default FeedbackService;
