import ApiService from "@/services/api";

function mapApiResponse(response) {
  return {
    uuid: response.id,
    user: response.user,
    contract: response.contract,
    date: { start: response.started }
  };
}

const BASE_URL = "/clockedinshifts/";

const ClockService = {
  create: async function (data) {
    const requestData = {
      method: "post",
      url: BASE_URL,
      data
    };

    return new Promise((resolve, reject) => {
      return ApiService.customRequest(requestData)
        .then((response) => {
          const shift = mapApiResponse(response.data);

          return resolve(shift);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  get: async function () {
    return new Promise((resolve, reject) => {
      return ApiService.get(BASE_URL)
        .then((response) => {
          const shift = mapApiResponse(response.data);
          const newResponse = { ...response, shift };

          return resolve(newResponse);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  delete: async function (uuid) {
    return ApiService.delete(`${BASE_URL}${uuid}/`);
  }
};

export default ClockService;
