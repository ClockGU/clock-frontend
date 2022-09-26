import ApiService from "@/services/api";
import { mapShiftApiResponse, Shift } from "@/models/ShiftModel";
import { mapContractApiResponse, Contract } from "@/models/ContractModel";
import { mapReportApiResponse, Report } from "@/models/ReportModel";
import is from "ramda/src/is";

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
  static async bulkCreate(payloadArray) {
    let promises = [];
    if (!is(Array, payloadArray)) {
      throw Error("Provided payload is NOT an Array");
    }
    try {
      for (const obj of payloadArray) {
        promises.push(this.create(obj));
      }
      return Promise.all(promises).then((values) => {
        return values.map((item) => this.mapFunction(item));
      });
    } catch (e) {
      throw Error(e.message);
    }
  }
  static async bulkUpdate(payloadArray) {
    let promises = [];
    if (!is(Array, payloadArray)) {
      throw Error("Provided payload is NOT an Array");
    }
    try {
      for (const obj of payloadArray) {
        promises.push(this.update(obj, obj.id));
      }
      return Promise.all(promises).then((values) => {
        return values.map((item) => this.mapFunction(item));
      });
    } catch (e) {
      throw Error(e.message);
    }
  }
  static async bulkDelete(payloadArray) {
    let promises = [];
    if (!is(Array, payloadArray)) {
      throw Error("Provided payload is NOT an Array");
    }
    try {
      for (const obj of payloadArray) {
        promises.push(this.delete(obj.id));
      }
      await Promise.all(promises);
      return undefined;
    } catch (e) {
      throw Error(e.message);
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
  static async filterList(filterString) {
    const response = await ApiService.get(this.BASE_URL + filterString);
    return response.data.map(
      (item) => new this.MODEL_CLASS(this.mapFunction(item))
    );
  }
}

export class ContractService extends modelService {
  static BASE_URL = "/contracts/";
  static mapFunction = mapContractApiResponse;
  static MODEL_CLASS = Contract;
  constructor() {
    super();
  }
  static async lock({ id, month, year }) {
    return ApiService.post(`${this.BASE_URL}${id}/${month}/${year}/lock/`);
  }
}

export class ReportService extends modelService {
  static BASE_URL = "/reports/";
  static mapFunction = mapReportApiResponse;
  static MODEL_CLASS = Report;
  constructor() {
    super();
  }
  static async get(id) {
    const requestData = {
      method: "get",
      url: this.BASE_URL + `${id}/export/`,
      responseType: "arraybuffer"
    };
    return ApiService.customRequest(requestData);
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
  static async bulkCreate() {
    return undefined;
  }
  static async bulkUpdate() {
    return undefined;
  }
  static async bulkDelete() {
    return undefined;
  }
}
