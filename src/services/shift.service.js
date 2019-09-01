import ApiService from "@/services/api.service";
import store from "@/store";

// class ShiftError extends Error {
//   constructor(errorCode, message) {
//     super(message);
//     this.name = this.constructor.name;
//     this.message = message;
//     this.errorCode = errorCode;
//   }
// }

function mapApiResponse(response) {
  return {
    uuid: response.id,
    user: response.user,
    contract: response.contract,
    date: { start: response.started, end: response.stopped },
    type: response.type,
    note: response.note,
    tags: response.tags
  };
}

const BASE_URL = "/api/shifts/";

const ShiftService = {
  list: async function() {
    try {
      const response = await ApiService.get(BASE_URL);
      const data = new Promise(resolve => {
        const data = response.data.map(item => mapApiResponse(item));
        const newResponse = { ...response, data };

        resolve(newResponse);
      });

      return data;
    } catch (error) {
      throw new Error(error);
    }
  },
  get: async function(uuid) {
    try {
      const response = await ApiService.get(BASE_URL + `${uuid}`);
      const data = new Promise(resolve => {
        const data = mapApiResponse(response.data);
        const newResponse = { ...response, data };

        resolve(newResponse);
      });

      return data;
    } catch (error) {
      throw new Error(error);
    }
  },
  create: async function(data) {
    try {
      const response = await ApiService.post(`${BASE_URL}`, data);
      const shift = mapApiResponse(response.data);
      store.dispatch("shift/addShift", shift);

      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
  update: async function(data, uuid) {
    try {
      const response = await ApiService.patch(`${BASE_URL}${uuid}/`, data);
      const shift = mapApiResponse(response.data);
      store.dispatch("shift/updateShift", shift);

      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
  delete: async function(uuid) {
    try {
      const response = await ApiService.delete(`${BASE_URL}${uuid}/`);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
  call: async function({ data = null, url = `${BASE_URL}`, method = "post" }) {
    const requestData = {
      method: method,
      url: url,
      data
    };

    try {
      const response = await ApiService.customRequest(requestData);

      return response.data.map(item => mapApiResponse(item));
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default ShiftService;
