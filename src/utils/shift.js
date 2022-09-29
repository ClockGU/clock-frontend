import { Shift } from "@/models/ShiftModel";
import { areIntervalsOverlapping, parseISO } from "date-fns";
import { localizedFormat } from "@/utils/date";

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
