import ApiService from "@/services/api";
import store from "@/store";

function mapApiResponse(response) {
  return {
    uuid: response.id,
    user: response.user,
    contract: response.contract,
    date: { start: response.started, end: response.stopped },
    type: response.type,
    note: response.note,
    tags: response.tags,
    locked: response.locked,
    reviewed: response.was_reviewed,
    created_at: new Date(response.created_at),
    modified_at: new Date(response.modified_at)
  };
}

const BASE_URL = "/shifts/";

const ShiftService = {
  create: function (data) {
    return ApiService.post(BASE_URL, { ...data });
  },
  get: async function (uuid) {
    return new Promise((resolve, reject) => {
      return ApiService.get(BASE_URL + `${uuid}`)
        .then((response) => {
          const shift = mapApiResponse(response.data);
          // TODO: we might need to use `{ ...response, data: shift }` here!?
          const newResponse = { ...response, shift };

          return resolve(newResponse);
        })
        .catch((error) => {
          reject(error);
        });
    });
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
  },
  update: async function (data, uuid) {
    return new Promise((resolve, reject) => {
      return ApiService.patch(`${BASE_URL}${uuid}/`, data)
        .then((response) => {
          const shift = mapApiResponse(response.data);
          store.dispatch("shift/updateShift", shift);

          return resolve(shift);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  delete: async function (uuid) {
    return new Promise((resolve, reject) => {
      return ApiService.delete(`${BASE_URL}${uuid}/`)
        .then((response) => {
          return resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};

export default ShiftService;
