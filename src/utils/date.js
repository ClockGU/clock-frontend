import {
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths
} from "date-fns";

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
