import ApiService from "@/services/api.service";
import store from "@/store";

class ShiftError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
  }
}

function mapApiResponse(response) {
  return {
    uuid: response.id,
    user: response.user,
    contract: response.contract,
    date: { start: response.started, end: response.stopped },
    type: response.type,
    note: response.note,
    tags: response.tags,
    exported: response.was_exported,
    reviewed: response.was_reviewed
  };
}

const BASE_URL = "/api/shifts/";

const ShiftService = {
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
          store.dispatch("shift/addShift", shift);

          return resolve(shift);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  get: async function(uuid) {
    return new Promise((resolve, reject) => {
      return ApiService.get(BASE_URL + `${uuid}`)
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
          const shift = mapApiResponse(response.data);
          store.dispatch("shift/updateShift", shift);

          return resolve(shift);
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

export default ShiftService;
