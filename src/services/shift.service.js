import ApiService from "@/services/api.service";

class ShiftError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
  }
}

const ShiftService = {
  create: async function(data) {
    const requestData = {
      method: "post",
      url: "/api/shifts/",
      data
    };

    try {
      const response = await ApiService.customRequest(requestData);
      console.log(response);
    } catch (error) {
      throw new ShiftError(error.response.status, error.response.data.detail);
    }
  }
};

export default ShiftService;
