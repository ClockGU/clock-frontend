import is from "ramda/src/is";
import {
  differenceInMinutes,
  getDate,
  getMonth,
  getYear,
  setDate,
  setMonth,
  setYear
} from "date-fns";
import { localizedFormat } from "@/utils/date";
import { minutesToHHMM } from "@/utils/time";

function defaultValueTime(type) {
  const today = new Date();
  const [hour, minute, second] = type === "start" ? [10, 0, 0] : [10, 30, 0];
  today.setHours(hour, minute, second);

  return today;
}

export const SHIFT_TYPES = [
  { text: "Normal shift", value: "st" },
  { text: "Sick leave", value: "sk" },
  { text: "Vacation", value: "vn" },
  { text: "Bank holiday", value: "bh" }
];

export class Shift {
  constructor({
    uuid = null,
    user = null,
    date = { start: null, end: null, mod: null },
    contract = null,
    type = null,
    note = null,
    tags = null,
    reviewed = null,
    locked = null
  } = {}) {
    this.uuid = is(String, uuid) ? uuid : null;
    this.user = is(String, user) ? user : null;
    this.date = {
      start: is(Date, new Date(date.start))
        ? new Date(date.start)
        : defaultValueTime("start"),
      end: is(Date, new Date(date.end))
        ? new Date(date.end)
        : defaultValueTime("end"),
      mod: is(Date, new Date(date.mod))
        ? new Date(date.mod)
        : defaultValueTime("mod")
    };
    this.contract = is(String, contract) ? contract : null;
    this.type = is(Object, type)
      ? type
      : SHIFT_TYPES.find((item) => item.value === type);
    this.note = is(String, note) ? note : "";
    this.tags = is(Array, tags) ? tags : [];
    this.reviewed = reviewed === null ? false : reviewed;
    this.locked = locked === null ? false : locked;
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

  get mod() {
    return this.date.mod;
  }

  set end(value) {
    this.date.end = value;
  }

  get duration() {
    return differenceInMinutes(this.end, this.start);
  }

  representationalDuration(format = "") {
    return minutesToHHMM(this.duration, format);
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
      contract: this.contract,
      tags: this.tags,
      type: this.type.value,
      note: this.note,
      uuid: this.uuid,
      started: localizedFormat(this.start, "yyyy-MM-dd HH:mm:ssXXX", {
        locale: { localize: "en" }
      }),
      stopped: localizedFormat(this.end, "yyyy-MM-dd HH:mm:ssXXX", {
        locale: { localize: "en" }
      }),
      duration: this.representationalDuration,
      was_reviewed: this.reviewed,
      locked: this.locked
    };
  }
}
