import ApiService from "@/services/api.service";

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
  create: async function(data) {
    try {
      const response = await ApiService.post(`${BASE_URL}`, data);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
  update: function(data, uuid) {
    try {
      const response = ApiService.patch(`${BASE_URL}${uuid}/`, data);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
  delete: function(uuid) {
    try {
      const response = ApiService.delete(`${BASE_URL}${uuid}/`);
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
