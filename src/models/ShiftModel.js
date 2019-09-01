import { is } from "ramda";
import {
  differenceInMinutes,
  parse,
  getDate,
  getMonth,
  getYear,
  setDate,
  setMonth,
  setYear
} from "date-fns";
import { minutesToHHMM } from "@/utils/time";

function defaultValueTime(type) {
  const today = new Date();
  const [hour, minute, second] = type === "start" ? [10, 0, 0] : [10, 30, 0];
  today.setHours(hour, minute, second);

  return today;
}

const SHIFT_TYPES = [
  { text: "Shift", value: "st" },
  { text: "Sick", value: "sk" },
  { text: "Vacation", value: "vn" }
];

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
      start: is(Date, new Date(date.start))
        ? new Date(date.start)
        : defaultValueTime("start"),
      end: is(Date, new Date(date.end))
        ? new Date(date.end)
        : defaultValueTime("end")
    };
    this.contract = is(String, contract) ? contract : null;
    this.type = is(Object, type)
      ? type
      : SHIFT_TYPES.find(item => item.value === type);
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

  setToday() {
    const today = Date.now();
    const [year, month, day] = [
      getYear(today),
      getMonth(today),
      getDate(today)
    ];

    this.setDate(year, month, day, "start");
    this.setDate(year, month, day, "end");
  }

  setDate(year, month, day, type) {
    let date = this.date[type];

    date = setYear(date, year);
    date = setMonth(date, month);
    date = setDate(date, day);

    this.date[type] = date;
  }

  toPayload() {
    return {
      uuid: this.uuid,
      user: this.user,
      contract: this.contract,
      tags: this.tags,
      type: this.type.value,
      started: this.start,
      stopped: this.end,
      duration: this.representationalDuration,
      was_reviewed: true
    };
  }
}
