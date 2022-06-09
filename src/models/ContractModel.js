import is from "ramda/src/is";
import { format, differenceInCalendarDays, startOfMonth } from "date-fns";
import { defaultContractDate } from "@/utils/date";

Number.prototype.pad = function (size) {
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
    worktime = null,
    date = { start: null, end: null },
    carryoverTargetDate = null,
    carryoverTime = null
  } = {}) {
    this.uuid = is(String, uuid) ? uuid : null;
    this.user = is(String, user) ? user : null;
    this.name = is(String, name) ? name : null;
    this.worktime = is(Number, worktime)
      ? this.minutesToTimestring(worktime)
      : "";
    this.date = {
      start: is(Date, new Date(date.start))
        ? date.start
        : defaultContractDate({ type: "start" }),
      end: is(Date, new Date(date.end))
        ? date.end
        : defaultContractDate({ type: "end" })
    };
    this.carryoverTargetDate =
      is(Date, new Date(carryoverTargetDate)) && carryoverTargetDate !== null
        ? carryoverTargetDate
        : startOfMonth(this.date.start);
    this.carryoverTime = is(Number, carryoverTime)
      ? this.minutesToTimestring(carryoverTime)
      : "";
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

  timestringToMinutes(time) {
    if (time == "") {
      return 0;
    }

    let negative = false;
    let [hours, minutes] = time.split(":");

    // Is the time negative?
    if (hours.indexOf("-") === 0) {
      hours = hours.slice(1);
      negative = true;
    }

    minutes = parseFloat(hours) * 60 + parseFloat(minutes);

    if (negative) {
      minutes = minutes * -1;
    }

    return minutes;
  }

  minutesToTimestring(value) {
    let sign = "";

    if (value < 0) {
      sign = "-";
    }
    const positiveValue = Math.abs(value);

    const hours = Math.floor(positiveValue / 60);
    const minutes = positiveValue % 60;

    return `${sign}${hours.pad(2)}:${minutes.pad(2)}`;
  }

  convertCarryoverTargetDate() {
    const targetDate = new Date(this.carryoverTargetDate);

    return format(startOfMonth(targetDate), "yyyy-MM-dd");
  }

  toPayload() {
    return {
      name: this.name,
      minutes: this.timestringToMinutes(this.worktime),
      start_date: this.start,
      end_date: this.end,
      carryover_target_date: this.convertCarryoverTargetDate(),
      initial_carryover_minutes: this.timestringToMinutes(this.carryoverTime)
    };
  }
}
