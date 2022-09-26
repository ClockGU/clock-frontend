import ApiService from "@/services/api";
import { mapShiftApiResponse, Shift } from "@/models/ShiftModel";

export class ClockedInShiftService {
  static BASE_URL = "/clockedinshifts/";
  static mapFunction = mapShiftApiResponse;
  static MODEL_CLASS = Shift;

  static async create(payload) {
    const response = await ApiService.post(this.BASE_URL, payload);
    if (response.status === 201) {
      return new this.MODEL_CLASS(this.mapFunction(response.data));
    } else {
      // TODO: Appwide errorhandling
      throw Error(response.data);
    }
  }
  static async get() {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await ApiService.get(this.BASE_URL);
      return new this.MODEL_CLASS(this.mapFunction(response.data));
    } catch (err) {
      if (err.response.status === 404) {
        return undefined;
      }
    }
    // eslint-disable-next-line no-undef
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
