import ApiService from "@/services/api";

const BASE_URL = "/reports/";

const ReportService = {
  get: async function(uuid) {
    const requestData = {
      method: "get",
      url: BASE_URL + `${uuid}/export/`,
      responseType: "arraybuffer"
    };
    return ApiService.customRequest(requestData);
  }
};

export default ReportService;
