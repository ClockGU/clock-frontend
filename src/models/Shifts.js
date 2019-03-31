import { is } from "ramda";
import { differenceInMinutes } from "date-fns";

function defaultValueTime(type) {
  const today = new Date();
  const [hour, minute, second] = type === "start" ? [10, 0, 0] : [10, 30, 0];
  today.setHours(hour, minute, second);

  return today;
}

export class Shift {
  constructor({
    uuid = null,
    user = null,
    date = { start: null, end: null },
    contract = null,
    type = null,
    note = null,
    tags = null
  } = {}) {
    this.uuid = is(String, uuid) ? uuid : null;
    this.user = is(String, user) ? user : null;
    this.date = {
      start: is(Date, date.start) ? date.start : defaultValueTime("start"),
      end: is(Date, date.end) ? date.end : defaultValueTime("end")
    };
    this.contract = is(String, contract) ? contract : null;
    this.type = is(String, type) ? type : { text: "Shift", value: "st" };
    this.note = is(String, note) ? note : "";
    this.tags = is(Array, tags) ? tags : [];
  }

  get start() {
    return this.date.start;
  }

  set start(value) {
    this.date.start = value;
  }

  get end() {
    return this.date.end;
  }

  set end(value) {
    this.date.end = value;
  }

  get duration() {
    return differenceInMinutes(this.date.end, this.date.start);
  }

  toPayload() {
    return {
      uuid: this.uuid,
      user: this.user,
      contract: this.contract,
      start: this.date.start,
      end: this.date.end,
      duration: this.duration
    };
  }
}
