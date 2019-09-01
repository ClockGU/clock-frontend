import ApiService from "@/services/api.service";
import store from "@/store";

class ContractError extends Error {
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
    name: response.name,
    date: { start: response.start_date, end: response.end_date },
    hours: response.hours
  };
}

const BASE_URL = "/api/contracts/";

const ContractService = {
  list: async function() {
    try {
      const response = await ApiService.get(BASE_URL);
      const data = new Promise(resolve => {
        const data = response.data.map(item => mapApiResponse(item));
        const newResponse = { ...response, data };

        setTimeout(() => resolve(newResponse), 400);
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
  call: async function({ data = null, method = "post" }) {
    const requestData = {
      method: method,
      url: BASE_URL,
      data
    };

    try {
      const response = await ApiService.customRequest(requestData);

      return response.data.map(item => mapApiResponse(item));
    } catch (error) {
      throw new ContractError(
        error.response.status,
        error.response.data.detail
      );
    }
  },
  create: async function(data) {
    const requestData = {
      method: "post",
      url: BASE_URL,
      data
    };

    try {
      const response = await ApiService.customRequest(requestData);
      const contract = mapApiResponse(response.data);
      store.dispatch("contract/addContract", contract);

      return response;
    } catch (error) {
      console.log(`ERROR: ${error}`);
      throw new ContractError(
        error.response.status,
        error.response.data.detail
      );
    }
  },
  update: async function(data, uuid) {
    try {
      const response = await ApiService.patch(`${BASE_URL}${uuid}/`, data);
      const contract = mapApiResponse(response.data);
      store.dispatch("contract/updateContract", contract);

      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
  delete: async function(uuid) {
    try {
      const response = await ApiService.delete(`${BASE_URL}${uuid}/`);

      store.dispatch("contract/deleteContract", uuid);

      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default ContractService;
