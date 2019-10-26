import ApiService from "@/services/api.service";

class ReportError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
  }
}

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

const BASE_URL = "/api/reports/";

const ReportService = {
  export: async function(uuid) {
    const requestData = {
      method: "get",
      url: BASE_URL + `${uuid}/export/`,
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
  },
  create: async function(data) {
    const requestData = {
      method: "post",
      url: BASE_URL,
      data
    };

    return new Promise((resolve, reject) => {
      return ApiService.customRequest(requestData)
        .then(response => {
          const report = mapApiResponse(response.data);
          // store.dispatch("report/addreport", report);

          return resolve(report);
        })
        .catch(error => {
          reject(
            new ReportError(
              error.response.status,
              error.response.data.non_field_errors[0]
            )
          );
        });
    });
  },
  get: async function(uuid) {
    return new Promise((resolve, reject) => {
      return ApiService.get(BASE_URL + `${uuid}`)
        .then(response => {
          const report = mapApiResponse(response.data);
          const newResponse = { ...response, report };

          return resolve(newResponse);
        })
        .catch(error => {
          reject(error);
        });
    });
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
  },
  update: async function(data, uuid) {
    return new Promise((resolve, reject) => {
      return ApiService.patch(`${BASE_URL}${uuid}/`, data)
        .then(response => {
          const report = mapApiResponse(response.data);
          // store.dispatch("report/updatereport", report);

          return resolve(report);
        })
        .catch(error => {
          reject(
            new ReportError(
              error.response.status,
              error.response.data.non_field_errors[0]
            )
          );
        });
    });
  },
  delete: async function(uuid) {
    return new Promise((resolve, reject) => {
      return ApiService.delete(`${BASE_URL}${uuid}/`)
        .then(response => {
          return resolve(response);
        })
        .catch(error => {
          reject(
            new ReportError(error.response.status, error.response.data.detail)
          );
        });
    });
  }
};

export default ReportService;
