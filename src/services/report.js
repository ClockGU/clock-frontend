import ApiService from "@/services/api";

function timedeltaToMinutes(timedelta) {
  const splitTimedelta = timedelta.split(" ");
  let days = 0;
  let timeString = splitTimedelta[0];

  if (splitTimedelta.length == 2) {
    [days, timeString] = splitTimedelta;
  }
  const [hours, minutes, seconds] = timeString.split(":");

  return (
    (parseInt(days) * 24 + parseInt(hours)) * 60 +
    parseInt(minutes) +
    parseInt(seconds) / 60
  );
}

function mapApiResponse(response) {
  return {
    uuid: response.id,
    contract: response.contract,
    duration: timedeltaToMinutes(response.hours),
    hours: response.hours,
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
