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

export function sufficientBreaktimeBetweenShifts(shifts, newShift) {
  let validator = new newShiftCutter(shifts, newShift);
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

  #getLastConcatenatedIndex(startIndex, directionRight) {
    if (directionRight) {
      // lets go to the right
      if (this.shifts.length === 1 || startIndex === this.shifts.length - 1)
        return startIndex;
      else {
        for (let i = Number(startIndex); i < this.shifts.length - 1; i++) {
          if (this.shifts[i].date.end !== this.shifts[i + 1].date.start)
            return i;
        }
        return this.shifts.length - 1;
      }
    } else {
      //lets go to the left
      if (startIndex === 0 || this.shifts.length === 1) return startIndex;
      else {
        for (let i = Number(startIndex); i > 0; i--) {
          if (this.shifts[i].date.start !== this.shifts[i - 1].date.end)
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
    let inTotalWorkBreakTime = coalescWorktimeAndBreaktime(this.shifts);
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
    if (
      (inTotalWorkBreakTime.worktime > 9 * 60 &&
        inTotalWorkBreakTime.breaktime < 45) ||
      (inTotalWorkBreakTime.worktime > 6 * 60 &&
        inTotalWorkBreakTime.worktime <= 9 * 60 &&
        inTotalWorkBreakTime.breaktime < 30) ||
      (leftSideWithNewShiftWorkBreak.breaktime === 0 &&
        leftSideWithNewShiftWorkBreak.worktime > 6 * 60) ||
      (rightSideWithNewShiftWorkBreak.breaktime === 0 &&
        rightSideWithNewShiftWorkBreak.worktime > 6 * 60) ||
      concatenatedRightShiftsWorkBreak.worktime > 6 * 60 ||
      concatenatedLeftShiftsWorkBreak.worktime > 6 * 60
    )
      return false;
    return true;
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

    let inTotalWorkBreakTime = coalescWorktimeAndBreaktime(this.shifts);

    let newBreakInMinutes = 15;
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
    let newShiftLeftSideDuration = 0;
    let newShiftRightSideDuration = 0;

    if (
      leftOfNewShiftWorkBreakInMinutes.worktime === 0 &&
      rightOfNewShiftWorkBreakInMinutes.worktime === 0 &&
      this.shifts.length === 1
    ) {
      // new shift > 6h and the only shift this day
      newShiftLeftSideDuration = 6 * 60;
      newShiftRightSideDuration =
        newShiftDuration - newBreakInMinutes - newShiftLeftSideDuration;
    } else {
      if (
        concatenatedRightShiftsWorkBreak.worktime > 6 * 60 ||
        rightSideWithNewShiftWorkBreak.worktime > 6 * 60
      ) {
        newShiftRightSideDuration =
          360 - rightOfNewShiftWorkBreakInMinutes.worktime;
        if (newShiftRightSideDuration + newBreakInMinutes > newShiftDuration)
          newShiftRightSideDuration = newShiftDuration - newBreakInMinutes;
        else {
          newShiftLeftSideDuration =
            newShiftDuration - newBreakInMinutes - newShiftRightSideDuration;
        }
      }
      if (
        concatenatedLeftShiftsWorkBreak.worktime > 6 * 60 ||
        leftSideWithNewShiftWorkBreak.worktime > 6 * 60 ||
        inTotalWorkBreakTime.worktime > 6 * 60
      ) {
        // left with new shift is more than 6h

        newShiftLeftSideDuration =
          360 - leftOfNewShiftWorkBreakInMinutes.worktime;

        if (newShiftRightSideDuration === 0) {
          if (newShiftLeftSideDuration + newBreakInMinutes > newShiftDuration)
            newShiftLeftSideDuration = newShiftDuration - newBreakInMinutes;
          else {
            newShiftRightSideDuration =
              newShiftDuration - newBreakInMinutes - newShiftLeftSideDuration;
          }
        } else {
          if (
            newShiftLeftSideDuration +
              newBreakInMinutes +
              newShiftRightSideDuration >
            newShiftDuration
          )
            newShiftLeftSideDuration =
              newShiftDuration - newBreakInMinutes - newShiftRightSideDuration;
          else {
            newBreakInMinutes =
              newShiftDuration -
              newShiftRightSideDuration -
              newShiftLeftSideDuration;
          }
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
