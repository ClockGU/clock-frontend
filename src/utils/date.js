import { currentLocale } from "@/plugins/i18n";
import {
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  format
} from "date-fns";

export const localizedFormat = (date, fmt, options = {}) => {
  return format(date, fmt, { ...options, ...currentLocale });
};

export const getToday = () => {
  return new Date().toLocaleDateString();
};

export const dateOperations = {
  addDays: addDays,
  subDays: subDays,
  addWeeks: addWeeks,
  subWeeks: subWeeks,
  addMonths: addMonths,
  subMonths: subMonths
};

export const getRouterProps = (type, date = new Date()) => {
  const [year, month, day] = [
    String(date.getUTCFullYear()),
    String(date.getUTCMonth() + 1),
    String(date.getUTCDate())
  ];

  return {
    type: type,
    year: year,
    month: month,
    day: day
  };
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
