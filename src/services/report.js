import ApiService from "@/services/api";
import { timedeltaToMinutes } from "@/utils/time";

function mapApiResponse(response) {
  return {
    uuid: response.id,
    contract: response.contract,
    duration: timedeltaToMinutes(response.worktime),
    worktime: response.worktime,
    carryover: {
      prev: response.carryover_previous_month,
      next: response.carryover
    },
    debit_worktime: response.debit_worktime,
    net_worktime: response.worktime,
    date: response.month_year,
    exported: false
  };
}

const BASE_URL = "/reports/";

const ReportService = {
  get: async function (uuid) {
    const requestData = {
      method: "get",
      url: BASE_URL + `${uuid}/export/`,
      responseType: "arraybuffer"
    };
    return ApiService.customRequest(requestData);
  },
  list: async function () {
    return new Promise((resolve, reject) => {
      ApiService.get(BASE_URL)
        .then((response) => {
          const data = response.data.map((item) => mapApiResponse(item));
          const newResponse = { ...response, data };
          resolve(newResponse);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};

export default ReportService;
