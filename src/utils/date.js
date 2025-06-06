import { currentLocale } from "@/plugins/i18n";
import {
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  format,
  addMinutes,
  parse,
  subMinutes,
  startOfMonth
} from "date-fns";

import Holidays from "date-holidays";
import { parseInput } from "rrule/dist/esm/rrulestr";

export function dateIsHoliday(date) {
  // Christmas Eve and New Year's Eve are considered half Bank holidays
  // by the date-holidays package.
  // So we need to treat it separately
  if (
    date.getMonth() === 11 &&
    (date.getDate() === 24 || date.getDate() === 31)
  ) {
    return true;
  }
  const hd = new Holidays("DE", "HE");
  const holidayCandidate = hd.isHoliday(date); // returns false or array ... strange
  if (!holidayCandidate) {
    return holidayCandidate;
  }
  return (
    holidayCandidate[0].type === "public" || holidayCandidate[0].type === "bank"
  );
}

export const localizedFormat = (date, fmt, options = {}) => {
  return format(date, fmt, { ...options, ...currentLocale });
};

export const getToday = () => {
  return new Date().toLocaleDateString();
};

export const parseDate = (dateString) => {
  return parse(dateString, "yyyy-MM-dd", new Date());
}

export const dateOperations = {
  addDays: addDays,
  subDays: subDays,
  addWeeks: addWeeks,
  subWeeks: subWeeks,
  addMonths: addMonths,
  subMonths: subMonths,
  addMinutes: addMinutes,
  subMinutes: subMinutes
};

export function defaultContractDate({
  type = "start",
  date = new Date()
} = {}) {
  let startYear, stopYear;
  startYear = stopYear = date.getFullYear();
  let [startMonth, stopMonth] = [9, 2];

  if (date.getMonth() <= 2) {
    startYear = stopYear - 1;
  } else if (date.getMonth() >= 9) {
    stopYear = stopYear + 1;
  } else {
    [startMonth, stopMonth] = [3, 8];
  }

  const newDate =
    type === "start"
      ? new Date(startYear, startMonth, 1)
      : new Date(stopYear, stopMonth, stopMonth === 2 ? 31 : 30);

  return newDate;
}

export function getFirstOfCurrentMonth() {
  return getFirstOfMonth(new Date());
}

export function getLastOfCurrentMonth() {
  return getLastOfMonth(new Date());
}
// TODO: This wrapper is unnecessary
export function getFirstOfMonth(date) {
  return startOfMonth(date);
}

export function getLastOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getMondayOfWeek(date) {
  if (date.getDay() === 1) return date;
  return new Date(
    date.setDate(
      date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
    )
  );
}

export function getSundayOfWeek(date) {
  if (date.getDay() === 0) return date;
  // needs to add one week because sunday in germany is last day of the week
  return addWeeks(new Date(date.setDate(date.getDate() - date.getDay())), 1);
}

export const firstOfCurrentMonth = getFirstOfCurrentMonth();
export const lastOfCurrentMonth = getLastOfCurrentMonth();
