import ApiService from "@/services/api";

const BASE_URL = "/messages/";

const MessageService = {
  get: function () {
    return ApiService.get(BASE_URL);
  }
};

export default MessageService;
