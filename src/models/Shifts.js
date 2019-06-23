import { is } from "ramda";
import { differenceInMinutes, parse } from "date-fns";
import { minutesToHHMM } from "@/utils/time";

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
    return parse(this.date.start);
  }

  set start(value) {
    this.date.start = value;
  }

  get end() {
    return parse(this.date.end);
  }

  set end(value) {
    this.date.end = value;
  }

  get duration() {
    return differenceInMinutes(this.end, this.start);
  }

  get representationalDuration() {
    return minutesToHHMM(this.duration);
  }

  toPayload() {
    return {
      uuid: this.uuid,
      user: this.user,
      contract: this.contract,
      tags: this.tags.join(","),
      start: this.start,
      end: this.end,
      duration: this.representationalDuration
    };
  }
}
