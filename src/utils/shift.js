import { Shift } from "@/models/ShiftModel";
import { areIntervalsOverlapping, isEqual, parseISO } from "date-fns";
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

export function concatenatedShiftsTooLong(shifts, newShift) {
  let validator = new newShiftValidator(shifts, newShift);
  return validator.validateSufficientBreaks();
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

export function maxShifttimeExceeded(shifttime) {
  return shifttime > 6 * 60;
}

export class newShiftValidator {
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
      new_shift_local.uuid = "000";
      this.new_shift_uuid = "000";
      this.shifts.push(new_shift_local);
    }
    this.shifts = this.#privateSortShifts();
  }

  #getLastConcatenatedIndex(startIndex, directionRight) {
    if (directionRight) {
      // lets go to the right
      if (this.shifts.length === 1 || startIndex === this.shifts.length - 1)
        return startIndex;
      else {
        for (let i = Number(startIndex); i < this.shifts.length - 1; i++) {
          if (
            !isEqual(
              parseISO(this.shifts[i].date.end),
              parseISO(this.shifts[i + 1].date.start)
            )
          )
            return i;
        }
        return this.shifts.length - 1;
      }
    } else {
      //lets go to the left
      if (startIndex === 0 || this.shifts.length === 1) return startIndex;
      else {
        for (let i = Number(startIndex); i > 0; i--) {
          if (
            !isEqual(
              parseISO(this.shifts[i].date.start),
              parseISO(this.shifts[i - 1].date.end)
            )
          )
            return i;
        }
        return 0;
      }
    }
  }

  #privateSortShifts() {
    // todo: delete redundancy when refactor data filter is deployed
    return this.shifts.sort(
      (a, b) => parseISO(a.date.start) - parseISO(b.date.start)
    );
  }

  validateSufficientBreaks() {
    // let inTotalWorkBreakTime = coalescWorktimeAndBreaktime(this.shifts);
    let newShiftIndex = this.shifts.findIndex(
      (shift) => shift.uuid === this.new_shift_uuid
    );
    let leftSideWithNewShiftWorkBreak = coalescWorktimeAndBreaktime(
      this.shifts.slice(0, newShiftIndex + 1)
    );
    let rightSideWithNewShiftWorkBreak = coalescWorktimeAndBreaktime(
      this.shifts.slice(newShiftIndex, this.shifts.length)
    );
    let concatenatedRightShiftsWorkBreak = coalescWorktimeAndBreaktime(
      this.shifts.slice(
        newShiftIndex,
        this.#getLastConcatenatedIndex(newShiftIndex, true) + 1
      )
    );
    let concatenatedLeftShiftsWorkBreak = coalescWorktimeAndBreaktime(
      this.shifts.slice(
        this.#getLastConcatenatedIndex(newShiftIndex, false),
        newShiftIndex + 1
      )
    );
    return (
      (leftSideWithNewShiftWorkBreak.breaktime === 0 &&
        leftSideWithNewShiftWorkBreak.worktime > 6 * 60) ||
      (rightSideWithNewShiftWorkBreak.breaktime === 0 &&
        rightSideWithNewShiftWorkBreak.worktime > 6 * 60) ||
      concatenatedRightShiftsWorkBreak.worktime > 6 * 60 ||
      concatenatedLeftShiftsWorkBreak.worktime > 6 * 60
    );
  }
}
