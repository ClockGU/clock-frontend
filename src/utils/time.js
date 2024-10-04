import { differenceInMinutes, parseISO } from "date-fns";
import { localizedFormat } from "@/utils/date";
import { sum } from "ramda";
import is from "ramda/src/is";
Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

export const isNumeric = (value) => /^-?\d+$/.test(value);

export function splitStringAtColon(string) {
  const values = string.split(":");

  if (values.length > 2) {
    throw new Error("string cannot contain more than one colon");
  }

  return values;
}

export function splitStringAtDecimal(string) {
  const values = string.split(".");

  if (values.length > 2) {
    throw new Error("string cannot contain more than one comma");
  }

  return values;
}

function validateHours(value) {
  if (value > 23) {
    throw new Error(`invalid input: "${value}"`);
  }
}

function validateMinutes(value) {
  if (value > 59) {
    throw new Error(`invalid input: "${value}"`);
  }
}

export function validateTimeInput(value) {
  // Validate a time input given with or without a colon.
  // Can parse multiple formats:
  // HH:mm, H:mm, HH:, HH, H, HHmm, Hmm

  let fn;
  if (value.includes(":")) {
    fn = parseString;
  } else {
    fn = parseStringWithoutColon;
  }

  let [hours, minutes] = fn(value);

  // Make sure the input is numeric
  const inputIsNumeric = isNumeric(hours) && isNumeric(minutes);
  if (!inputIsNumeric) {
    throw new Error(`time input is invalid: "${value}"`);
  }

  // Convert hours and minutes from strings to integers
  [hours, minutes] = [parseInt(hours).pad(2), parseInt(minutes).pad(2)];

  // Validate hours and minutes
  validateHours(hours);
  validateMinutes(minutes);

  return `${hours}:${minutes}`;
}

export function validateWorktimeInput(value) {
  // Validate a worktime input given with or without a colon.
  // Valid worktimes can be any number of hours and 59 minutes max.
  // Can parse multiple formats: HH:mm, H:mm, HH:, HH, H, HHmm, Hmm
  // as well as HH,<hh> and HH.<hh>

  // strip minus sign for negative values to facilitate parsing
  // set 'negative' flag to add minus sign later
  let negative = false;
  if (value.includes("-")) {
    negative = true;
    value = value.replace("-", "");
  }

  let fn;
  if (value.includes(":")) {
    fn = parseString;
  } else if (value.includes(",") || value.includes(".")) {
    fn = parseStringWithDecimalHours;
  } else {
    fn = parseStringWithoutColon;
  }

  let [hours, minutes] = fn(value);

  // Make sure the input is numeric
  const inputIsNumeric = isNumeric(hours) && isNumeric(minutes);
  if (!inputIsNumeric) {
    throw new Error(`time input is invalid: "${value}"`);
  }

  // Convert hours and minutes from strings to integers
  let retValue = parseInt(hours) * 60 + parseInt(minutes);
  validateMinutes(minutes);

  // handle negative values
  return negative ? -1 * retValue : retValue;
}

export function parseString(value) {
  // Parse a string in the form of "HH:mm".
  //  Returns array of two strings.

  // Split value at colon
  let [hours, minutes] = splitStringAtColon(value);

  // Handle input values such as "123456:00" correctly by parsing again the
  // hours multiplet and overriding our old minutes value.
  let newMinutes;
  [hours, newMinutes] = parseStringWithoutColon(hours);

  // If the previous minutes were unset or equal to "00", set them to the new
  // value.
  if (minutes === "00" || minutes === "") {
    minutes = newMinutes;
  }

  return [hours, minutes];
}

export function parseStringWithDecimalHours(value) {
  //Parse a string in the forms of "HH,<hh>" or "HH.<hh>"
  //assuming that <hh> are fractional hours
  //Returns array of two strings [hours, minutes]

  //convert string to decimal point if necessary
  let decimalValue = value.includes(",") ? value.replace(",", ".") : value;

  //get hours by truncation of the decimal number
  let hours = Math.trunc(decimalValue).toString();

  //convert decimal part to minutes
  let minutes = Math.abs(
    Math.round(parseFloat(decimalValue % 1) * 60).toString()
  );

  return [hours, minutes];
}

export function parseStringWithoutColon(value) {
  // Parse a string in the forms of "HHmm", "Hmm", "HH" or "H".
  // Returns array of two strings.
  if (value.length < 3) {
    return parseDublet(value);
  }

  if (value.length < 4) {
    return parseTriplet(value);
  }

  return parseMultiplet(value);
}

export function parseDublet(value) {
  // Assume we are only handling an hour value.
  const hours = value;
  const minutes = "00";

  return [hours, minutes];
}

export function parseTriplet(value) {
  // Parse `value` and split it into H:mm. Return the time in minutes. "123"
  // will be interpreted as "1:23" and converted to 83.

  const hours = value.slice(0, 1);
  const minutes = value.slice(1, 3);

  return [hours, minutes];
}

export function parseMultiplet(value) {
  // Only consider the first four characters.

  const hours = value.slice(0, 2);
  const minutes = value.slice(2, 4);

  return [hours, minutes];
}

export function timedeltaToMinutes(timedelta) {
  const splitTimedelta = timedelta.split(" ");
  let days = 0;
  let timeString = splitTimedelta[0];

  if (splitTimedelta.length === 2) {
    [days, timeString] = splitTimedelta;
  }
  // eslint-disable-next-line no-unused-vars
  const [hours, minutes, seconds] = timeString
    .split(":")
    .map((item) => parseInt(item));
  days = parseInt(days);

  return (days * 24 + hours) * 60 + minutes;
}

export function minutesToHHMM(min, format) {
  const sign = min < 0 ? "-" : "";

  min = Math.abs(min);
  const hours = Math.floor(min / 60).pad(2);
  const minutes = (min % 60).pad(2);

  return format === "hm"
    ? `${sign}${hours}h ${minutes}m`
    : `${sign}${hours}:${minutes}`;
}

export function hoursToHHMM(floatHours, format) {
  const hours = Math.floor(floatHours);
  const minutes = parseInt((60 * (floatHours - hours)).toFixed(0));

  return minutesToHHMM(minutes, format);
}

export function formattedTime(time) {
  const [hours, minutes] = time.split(":");

  return `${hours}h${minutes}m`;
}

export function startEndHours(date) {
  const start = new Date(date);
  const end = new Date(date);
  const hours = date.getHours();

  if (hours === 0) {
    // At the beginning of the day, go one hour to the front.
    start.setHours(0);
    end.setHours(1);
  } else if (hours === 23) {
    // At the end of the day, go one hour back from the last possible time.
    start.setHours(22);
    start.setMinutes(59);
    end.setHours(23);
    end.setMinutes(59);
  } else {
    // At any other point of the day, set the start one hour in the past.
    const hour = end.getHours();
    start.setHours(hour - 1);
  }

  // Reset seconds to 0.
  start.setSeconds(0);
  end.setSeconds(0);

  return {
    start,
    end
  };
}

export function coalescWorktimeAndBreaktime(shifts) {
  if (shifts.length === 0) return { worktime: 0, breaktime: 0 };

  const orderedShifts = shifts.sort(
    (a, b) => parseISO(a.date.start) - parseISO(b.date.start)
  );
  const worktimeInMinutes = sum(
    orderedShifts.map((shift) => {
      return differenceInMinutes(
        parseISO(shift.date.end),
        parseISO(shift.date.start)
      );
    })
  );
  const worktimeSpanInMinutes = differenceInMinutes(
    parseISO(orderedShifts[orderedShifts.length - 1].date.end),
    parseISO(orderedShifts[0].date.start)
  );
  const breaktimeInMinutes = worktimeSpanInMinutes - worktimeInMinutes;
  return { worktime: worktimeInMinutes, breaktime: breaktimeInMinutes };
}

export function formatDate(date, formatString = "do MMMM yyyy") {
  if (date === undefined) return;
  return localizedFormat(parseISO(date), formatString);
}

export function formatTime(date, formatString = "HH:mm") {
  if (date === undefined) return;
  return localizedFormat(date, formatString);
}

export function timestringToMinutes(time) {
  // Function taking a string og format "-HH:MM" converting
  // it to the equivalent time in minute representation.
  // Example:
  // 08:22 ==> 502
  // -03:10 ==> -190

  if (time === "") {
    return 0;
  }
  let negative = false;
  let [hours, minutes] = time.split(":");

  // Is the time negative?
  if (hours.indexOf("-") === 0) {
    hours = hours.slice(1);
    negative = true;
  }

  minutes = parseFloat(hours) * 60 + parseFloat(minutes);

  if (negative) {
    minutes = minutes * -1;
  }

  return minutes;
}
