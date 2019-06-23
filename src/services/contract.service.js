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

const ContractService = {
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
  }
};

export default ContractService;
