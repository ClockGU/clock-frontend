import ApiService from "@/services/api";

function timedeltaToMinutes(timedelta) {
  const splitTimedelta = timedelta.split(" ");
  let days = 0;
  let timeString = splitTimedelta[0];

  if (splitTimedelta.length == 2) {
    [days, timeString] = splitTimedelta;
  }
  // eslint-disable-next-line no-unused-vars
  const [hours, minutes, seconds] = timeString.split(":");

  return (parseInt(days) * 24 * 60 + parseInt(hours)) * 60 + parseInt(minutes);
}

function mapApiResponse(response) {
  return {
    uuid: response.id,
    contract: response.contract,
    duration: timedeltaToMinutes(response.worktime),
    worktime: response.worktime,
    date: response.month_year,
    exported: false
  };
}

const BASE_URL = "/reports/";

const ReportService = {
  get: async function(uuid) {
    const requestData = {
      method: "get",
      url: BASE_URL + `${uuid}/export/`,
      responseType: "arraybuffer"
    };
    return ApiService.customRequest(requestData);
  },
  list: async function() {
    return new Promise((resolve, reject) => {
      ApiService.get(BASE_URL)
        .then(response => {
          const data = response.data.map(item => mapApiResponse(item));
          const newResponse = { ...response, data };
          resolve(newResponse);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default ReportService;
