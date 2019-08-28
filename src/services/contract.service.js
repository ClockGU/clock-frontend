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
      url: "/api/contracts/",
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
  create: async function(data, uuid) {
    console.log(data);
    const requestData = {
      method: "post",
      url: "/api/contracts/",
      data
    };

    try {
      const response = await ApiService.customRequest(requestData);

      const contracts = store.state.contract.contracts;

      await contracts.forEach(function(contract, index) {
        if (contract.uuid === uuid) {
          this[index] = response;
        }
      }, contracts);
      console.log(contracts);
    } catch (error) {
      console.log(`ERROR: ${error}`);
      throw new ContractError(
        error.response.status,
        error.response.data.detail
      );
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
  }
};

export default ContractService;
