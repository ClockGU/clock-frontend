import is from "ramda/src/is";
import { differenceInCalendarDays } from "date-fns";
import { defaultContractDate } from "@/utils/date";

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};
export class Contract {
  constructor({
    uuid = null,
    user = null,
    name = null,
    minutes = null,
    date = { start: null, end: null }
  } = {}) {
    this.uuid = is(String, uuid) ? uuid : null;
    this.user = is(String, user) ? user : null;
    this.name = is(String, name) ? name : null;
    this.worktime = is(Number, minutes)
      ? this.minutesToWorktime(minutes)
      : null;
    this.date = {
      start: is(Date, new Date(date.start))
        ? date.start
        : defaultContractDate({ type: "start" }),
      end: is(Date, new Date(date.end))
        ? date.end
        : defaultContractDate({ type: "end" })
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
    return differenceInCalendarDays(this.end, this.start);
  }

  get remainingContractDuration() {
    return differenceInCalendarDays(this.end, new Date());
  }

  get hoursInMinutes() {
    const [hours, minutes] = this.worktime.split(":");

    return hours * 60 + minutes;
  }

  worktimeToMinutes() {
    let [hours, minutes] = this.worktime.split(":");
    minutes = parseFloat(hours) * 60 + parseFloat(minutes);

    return minutes;
  }

  minutesToWorktime(value) {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    return `${hours.pad(2)}:${minutes.pad(2)}`;
  }

  toPayload() {
    return {
      name: this.name,
      minutes: this.worktimeToMinutes(),
      start_date: this.start,
      end_date: this.end
    };
  }
}
