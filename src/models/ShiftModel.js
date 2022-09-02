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
import { any } from "ramda";

function defaultValueTime(type) {
  const today = new Date();
  const [hour, minute, second] = type === "start" ? [10, 0, 0] : [10, 30, 0];
  today.setHours(hour, minute, second);

  return today;
}

export function mapShiftApiResponse(response) {
  response["wasReviewed"] = response["was_reviewed"];
  delete response["was_reviewed"];
  return response;
}

export const SHIFT_TYPES = [
  { text: "Normal shift", value: "st" },
  { text: "Sick leave", value: "sk" },
  { text: "Vacation", value: "vn" },
  { text: "Bank holiday", value: "bh" }
];

export class Shift {
  constructor({
    id = null,
    user = null,
    started = null,
    stopped = null,
    contract = null,
    type = null,
    note = null,
    tags = null,
    wasReviewed = null,
    locked = null
  } = {}) {
    this.id = is(String, id) ? id : null;
    this.user = is(String, user) ? user : null;
    this.started = is(Date, new Date(started))
      ? new Date(started)
      : defaultValueTime("start");

    this.stopped = is(Date, new Date(stopped))
      ? new Date(stopped)
      : defaultValueTime("end");
    this.contract = is(String, contract) ? contract : null;
    this.type =
      is(String, type) && any(SHIFT_TYPES.map((item) => item.value === type))
        ? type
        : "st";
    this.note = is(String, note) ? note : "";
    this.tags = is(Array, tags) ? tags : [];
    this.wasReviewed = is(Boolean, wasReviewed) ? wasReviewed : false;
    this.locked = is(Boolean, locked) ? locked : false;
  }

  get duration() {
    return differenceInMinutes(this.stopped, this.stopped);
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

    this.setDate(year, month, day, "started");
    this.setDate(year, month, day, "stopped");
  }

  setDate(year, month, day, attrName) {
    let date = this[attrName];

    date = setYear(date, year);
    date = setMonth(date, month);
    date = setDate(date, day);

    this[attrName] = date;
  }

  toPayload() {
    return {
      id: this.id,
      user: this.user,
      started: localizedFormat(this.started, "yyyy-MM-dd HH:mm:ssXXX", {
        locale: { localize: "en" }
      }),
      stopped: localizedFormat(this.stopped, "yyyy-MM-dd HH:mm:ssXXX", {
        locale: { localize: "en" }
      }),
      contract: this.contract,
      type: this.type,
      note: this.note,
      tags: this.tags,
      was_reviewed: this.wasReviewed,
      locked: this.locked
    };
  }

  clone() {
    return new Shift(this.toPayload());
  }
}
