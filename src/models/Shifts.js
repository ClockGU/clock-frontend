import { is } from "ramda";
import { differenceInMinutes } from "date-fns";

function defaultValueTime(type) {
  const today = new Date();
  const [hour, minute] = type === "start" ? [10, 0] : [10, 30];
  today.setHours(hour, minute);

  return today;
}

export class Shift {
  constructor(shift = {}) {
    this.uuid = is(String, shift.uuid) ? shift.uuid : null;
    this.user = is(String, shift.user) ? shift.user : null;
    this._start = is(Date, shift.start)
      ? shift.start
      : defaultValueTime("start");
    this._end = is(Date, shift.end) ? shift.end : defaultValueTime("end");
    this.contract = is(String, shift.contract) ? shift.contract : null;
    this.type = is(String, shift.type) ? shift.type : "";
    this.note = is(String, shift.note) ? shift.note : "";
    this.tags = is(Array, shift.tags) ? shift.tags : [];
  }

  get start() {
    return this._start;
  }

  set start(value) {
    this._start = value;
  }

  get end() {
    return this._end;
  }

  set end(value) {
    this._end = value;
  }

  get duration() {
    return differenceInMinutes(this._end, this._start);
  }

  toPayload() {
    return {
      uuid: this.uuid,
      user: this.user,
      contract: this.contract,
      start: this._start,
      end: this._end,
      duration: this.duration
    };
  }
}
