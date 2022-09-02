import ApiService from "@/services/api";
import { mapShiftApiResponse, Shift } from "@/models/ShiftModel";
import { mapContractApiResponse, Contract } from "@/models/ContractModel";
import { mapReportApiResponse, Report } from "@/models/ReportModel";

class modelService {
  static BASE_URL = "";
  static mapFunction = undefined;
  static MODEL_CLASS = undefined;

  constructor() {}
  static async list() {
    const response = await ApiService.get(this.BASE_URL);
    return response.data.map(
      (item) => new this.MODEL_CLASS(this.mapFunction(item))
    );
  }
  static async create(payload) {
    const response = await ApiService.post(this.BASE_URL, payload);
    if (response.status === 201) {
      return new this.MODEL_CLASS(this.mapFunction(response.data));
    } else {
      // TODO: Appwide errorhandling
      throw Error(response.data);
    }
  }
  static async update(payload, id) {
    const response = await ApiService.patch(`${this.BASE_URL}${id}/`, payload);
    if (response.status === 200) {
      return new this.MODEL_CLASS(this.mapFunction(response.data));
    } else {
      // TODO: Appwide errorhandling
      throw Error(response.data);
    }
  }
  static async delete(id) {
    const response = await ApiService.delete(this.BASE_URL + `${id}`);
    if (response.status === 204) {
      return undefined;
    } else {
      // TODO: Appwide errorhandling
      throw Error(response.data);
    }
  }
}

export class ShiftService extends modelService {
  static BASE_URL = "/shifts/";
  static mapFunction = mapShiftApiResponse;
  static MODEL_CLASS = Shift;
  constructor() {
    super();
  }
}

export class ContractService extends modelService {
  static BASE_URL = "/contracts/";
  static mapFunction = mapContractApiResponse;
  static MODEL_CLASS = Contract;
  constructor() {
    super();
  }
}

export class ReportService extends modelService {
  static BASE_URL = "/reports/";
  static mapFunction = mapReportApiResponse;
  static MODEL_CLASS = Report;
  constructor() {
    super();
  }
  static async create() {
    return undefined;
  }
  static async update() {
    return undefined;
  }
  static async delete() {
    return undefined;
  }
}
