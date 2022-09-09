import { Shift } from "@/models/ShiftModel";
import {
  areIntervalsOverlapping,
  differenceInMinutes,
  parseISO
} from "date-fns";
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

export function maxShifttimeExceeded(shifttime) {
  return shifttime > 6 * 60;
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
      new_shift_local.uuid = "000";
      this.new_shift_uuid = "000";
      this.shifts.push(new_shift_local);
    }
    this.shifts = this.#privateSortShifts();
  }

  #privateSortShifts() {
    // todo: delete redundancy when refactor data filter is deployed
    return this.shifts.sort(
      (a, b) => parseISO(a.date.start) - parseISO(b.date.start)
    );
  }

  calculateCuts() {
    let newShiftIndex = this.shifts.findIndex(
      (shift) => shift.uuid === this.new_shift_uuid
    );

    const newShiftDuration = differenceInMinutes(
      parseISO(this.shifts[newShiftIndex].date.end),
      parseISO(this.shifts[newShiftIndex].date.start)
    );
    let leftOfNewShiftWorkBreakInMinutes = coalescWorktimeAndBreaktime(
      this.shifts.slice(0, newShiftIndex)
    );
    let rightOfNewShiftWorkBreakInMinutes = coalescWorktimeAndBreaktime(
      this.shifts.slice(newShiftIndex + 1, this.shifts.length)
    );

    let inTotalWorkBreakTime = coalescWorktimeAndBreaktime(this.shifts);

    let newBreakInMinutes = 15;
    let newShiftLeftSideDuration = 0;
    let newShiftRightSideDuration = 0;

    if (
      (inTotalWorkBreakTime.worktime > 540 &&
        inTotalWorkBreakTime.breaktime > 45) ||
      (inTotalWorkBreakTime.worktime > 360 &&
        inTotalWorkBreakTime.breaktime > 30) ||
      (leftOfNewShiftWorkBreakInMinutes.worktime === 0 &&
        rightOfNewShiftWorkBreakInMinutes.worktime === 0 &&
        this.shifts.length === 1)
    ) {
      // new shift > 6h and breaktime in total is already enough
      newShiftLeftSideDuration = 6 * 60;
      newShiftRightSideDuration =
        newShiftDuration - newBreakInMinutes - newShiftLeftSideDuration;
    } else {
      // calculate new needed breaktime
      if (inTotalWorkBreakTime.worktime > 540) {
        newBreakInMinutes =
          45 - inTotalWorkBreakTime.breaktime > 15
            ? 45 - inTotalWorkBreakTime.breaktime
            : 15;
      } else if (inTotalWorkBreakTime.worktime > 360) {
        newBreakInMinutes =
          30 - inTotalWorkBreakTime.breaktime > 15
            ? 30 - inTotalWorkBreakTime.breaktime
            : 15;
      }

      if (
        rightOfNewShiftWorkBreakInMinutes.worktime >
        leftOfNewShiftWorkBreakInMinutes.worktime
      ) {
        // right is more worktime

        newShiftRightSideDuration =
          360 - rightOfNewShiftWorkBreakInMinutes.worktime;
        if (newShiftRightSideDuration + newBreakInMinutes >= newShiftDuration)
          newShiftRightSideDuration = newShiftDuration - newBreakInMinutes;
        else {
          newShiftLeftSideDuration =
            newShiftDuration - newBreakInMinutes - newShiftRightSideDuration;
        }
      } else {
        // left is mor worktime OR both sides same worktime

        newShiftLeftSideDuration =
          360 - leftOfNewShiftWorkBreakInMinutes.worktime;
        if (newShiftLeftSideDuration + newBreakInMinutes >= newShiftDuration)
          newShiftLeftSideDuration = newShiftDuration - newBreakInMinutes;
        else {
          newShiftRightSideDuration =
            newShiftDuration - newBreakInMinutes - newShiftLeftSideDuration;
        }
      }
    }

    return {
      leftPartDuartion: newShiftLeftSideDuration,
      rightPartDuration: newShiftRightSideDuration,
      breaktime: newBreakInMinutes
    };
  }
}
