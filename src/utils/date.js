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
