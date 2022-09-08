import { Shift } from "@/models/ShiftModel";
import { areIntervalsOverlapping, parseISO } from "date-fns";
import { localizedFormat } from "@/utils/date";
import { coalescWorktimeAndBreaktime } from "@/utils/time";

function prepare({ start, end }) {
  return {
    start: parseISO(start),
    end: parseISO(end)
  };
}

export function datesGroupByComponent(dates, token) {
  return dates.reduce(function (val, obj) {
    let comp = localizedFormat(parseISO(obj["date"]["start"]), token);
    (val[comp] = val[comp] || []).push(new Shift(obj));
    return val;
  }, {});
}

export function getOverlappingShifts(shifts) {
  const matches = [];
  for (let i = 0; i <= shifts.length - 1; i++) {
    for (let j = i + 1; j <= shifts.length - 1; j++) {
      if (j == shifts.length) break;

      const shiftA = shifts[i];
      const shiftB = shifts[j];

      if (areIntervalsOverlapping(prepare(shiftA.date), prepare(shiftB.date))) {
        matches.push([shiftA, shiftB]);
      }
    }
  }
  return matches;
}

export function sufficientBreaktimeBetweenShifts({ worktime, breaktime }) {
  if (worktime > 9 * 60 && breaktime < 45) {
    return false;
  }
  return !(worktime > 6 * 60 && breaktime < 30);
}

export function missingBreaktime({ worktime, breaktime }) {
  if (worktime >= 9 * 60) {
    return 45 - breaktime;
  }
  return 30 - breaktime;
}

export function maxWorktimeExceeded(worktime) {
  return worktime > 10 * 60;
}

export class newShiftCutter {
  new_shift_uuid;
  shifts;

  constructor(old_shifts, new_shift) {
    this.new_shift_uuid = new_shift.uuid;
    this.shifts = old_shifts;
    if (!Array.isArray(old_shifts)) {
      this.shifts.push(old_shifts);
    }
    if (!this.shifts.find((shift) => shift.uuid === this.new_shift_uuid)) {
      let new_shift_local = new_shift.clone();
      new_shift_local.date.start = localizedFormat(
        new_shift_local.date.start,
        "yyyy-MM-dd HH:mm:ssXXX",
        {
          locale: { localize: "en" }
        }
      );
      new_shift_local.date.end = localizedFormat(
        new_shift_local.date.end,
        "yyyy-MM-dd HH:mm:ssXXX",
        {
          locale: { localize: "en" }
        }
      );
      this.shifts.push(new_shift_local);
    }
    this.shifts = this.#privateSortShifts();
  }

  #privateSortShifts() {
    // todo: delete redundancy when refactor data filter is deployed
    return this.shifts.sort((a, b) => a.date.start - b.date.start);
  }

  calculateCuts() {
    let new_shift_index = this.shifts.findIndex((shift) => {
      if (shift.uuid === this.new_shift_uuid) {
        return true;
      }
    });

    let leftNewShiftWorktimeInMinutes = coalescWorktimeAndBreaktime(
      this.shifts.slice(0, new_shift_index)
    ).worktime;
    let leftPartNewShiftInMinutes = 360 - leftNewShiftWorktimeInMinutes;

    let inTotalWorkBreakTime = coalescWorktimeAndBreaktime(this.shifts);
    let newBreakInMinutes = 15;

    if (inTotalWorkBreakTime.worktime > 360) {
      newBreakInMinutes =
        30 - inTotalWorkBreakTime.breaktime > 15
          ? 30 - inTotalWorkBreakTime.breaktime
          : 15;
    } else if (inTotalWorkBreakTime.worktime > 540) {
      newBreakInMinutes =
        45 - inTotalWorkBreakTime.breaktime > 15
          ? 45 - inTotalWorkBreakTime.breaktime
          : 15;
    }
    return {
      splitDuration: leftPartNewShiftInMinutes,
      breaktime: newBreakInMinutes
    };
  }
}
