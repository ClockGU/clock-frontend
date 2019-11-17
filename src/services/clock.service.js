import ApiService from "@/services/api.service";
import store from "@/store";

function mapApiResponse(response) {
  return {
    uuid: response.id,
    user: response.user,
    contract: response.contract,
    date: { start: response.started }
  };
}

const BASE_URL = "/api/clockedinshifts/";

const ClockService = {
  create: async function(data) {
    const requestData = {
      method: "post",
      url: BASE_URL,
      data
    };

    return new Promise((resolve, reject) => {
      return ApiService.customRequest(requestData)
        .then(response => {
          const shift = mapApiResponse(response.data);
          store.dispatch("shift/clockShift", shift);

          return resolve(shift);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  get: async function() {
    return new Promise((resolve, reject) => {
      return ApiService.get(BASE_URL)
        .then(response => {
          const shift = mapApiResponse(response.data);
          const newResponse = { ...response, shift };

          return resolve(newResponse);
        })
        .catch(error => {
          reject(error);
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
          reject(error);
        });
    });
  }
};

export default ClockService;
