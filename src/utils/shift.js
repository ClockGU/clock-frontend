import { Shift } from "@/models/ShiftModel";
import { format, parseISO } from "date-fns";

export function datesGroupByComponent(dates, token) {
  return dates.reduce(function(val, obj) {
    let comp = format(parseISO(obj["date"]["start"]), token);
    (val[comp] = val[comp] || []).push(new Shift(obj));
    return val;
  }, {});
}
