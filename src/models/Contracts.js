import { is } from "ramda";
import { differenceInDays } from "date-fns";

export function defaultDate({ type = "start", date = new Date() } = {}) {
  let startYear, stopYear;
  startYear = stopYear = date.getFullYear();
  let [startMonth, stopMonth] = [9, 2];

  if (date.getMonth() <= 2) {
    startYear = stopYear - 1;
  } else if (date.getMonth() >= 9) {
    stopYear = stopYear + 1;
  } else {
    [startMonth, stopMonth] = [3, 8];
  }

  return type === "start"
    ? new Date(startYear, startMonth, 1)
    : new Date(stopYear, stopMonth, stopMonth === 2 ? 31 : 30);
}

export class Contract {
  constructor({
    uuid = null,
    user = null,
    name = null,
    hours = null,
    date = { start: null, end: null }
  } = {}) {
    this.uuid = is(String, uuid) ? uuid : null;
    this.user = is(String, user) ? user : null;
    this.name = is(String, name) ? name : null;
    this.hours = is(Number, hours) ? hours : null;
    this.date = {
      start: is(Date, date.start) ? date.start : defaultDate("start"),
      end: is(Date, date.end) ? date.end : defaultDate("end")
    };
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
    return differenceInDays(this.date.end, this.date.start);
  }

  get remainingContractDuration() {
    return differenceInDays(this.date.end, new Date());
  }

  toPayload() {
    return {
      uuid: this.uuid,
      user: this.user,
      name: this.name,
      hours: this.hours,
      start_date: this.date.start,
      end_date: this.date.end
    };
  }
}
