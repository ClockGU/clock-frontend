import { parseISO } from "date-fns";
import { localizedFormat } from "@/utils/date";

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
  /*
  Validate a time input given with or without a colon. Can parse multiple formats:

  HH:mm, H:mm, HH:, HH, H, HHmm, Hmm
  */
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

export function parseString(value) {
  /*
  Parse a string in the form of ""HH:mm".

  Returns array of two strings.
  */
  // Split value at colon
  let [hours, minutes] = splitStringAtColon(value);

  // Handle input values such as "123456:00" correctly by parsing again the
  // hours multiplet and overriding our old minutes value.
  let newMinutes;
  [hours, newMinutes] = parseStringWithoutColon(hours);

  // If the previous minutes were unset or equal to "00", set them to the new
  // value.
  if (minutes === "00" || minutes == "") {
    minutes = newMinutes;
  }

  return [hours, minutes];
}

export function parseStringWithoutColon(value) {
  /*
  Parse a string in the forms of "HHmm", "Hmm", "HH" or "H".

  Returns array of two strings.
  */
  if (value.length < 3) {
    return parseDublet(value);
  }

  if (value.length < 4) {
    return parseTriplet(value);
  }

  return parseMultiplet(value);
}

export function parseDublet(value) {
  /*
  Assume we are only handling a hour value.
  */
  const hours = value;
  const minutes = "00";

  return [hours, minutes];
}

export function parseTriplet(value) {
  /*
   * Parse `value` and split it into H:mm. Return the time in minutes. "123"
   * will be interpreted as "1:23" and converted to 83.
   */
  const hours = value.slice(0, 1);
  const minutes = value.slice(1, 3);

  return [hours, minutes];
}

export function parseMultiplet(value) {
  /*
  Only consider the first four characters.
  */
  const hours = value.slice(0, 2);
  const minutes = value.slice(2, 4);

  return [hours, minutes];
}

export function timedeltaToMinutes(timedelta) {
  const splitTimedelta = timedelta.split(" ");
  let days = 0;
  let timeString = splitTimedelta[0];

  if (splitTimedelta.length == 2) {
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

export function startEndHours(date) {
  const start = new Date(date);
  const end = new Date(date);
  const hours = date.getHours();

  if (hours === 0) {
    // At the beginning of the day, go one hour to the front.
    start.setHours(0);
    end.setHours(1);
  } else if (hours == 23) {
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

export function hoursToWorktime(value) {
  const hours = Math.floor(value);
  const minutes = parseInt((60 * (value - hours)).toFixed(0));

  return `${hours.pad(2)}:${minutes.pad(2)}`;
}

export function formattedTime(time) {
  const [hours, minutes] = time.split(":");

  return `${hours}h${minutes}m`;
}

export function formatDate(date, formatString = "do MMMM yyyy") {
  if (date === undefined) return;
  return localizedFormat(parseISO(date), formatString);
}

export function formatTime(date, formatString = "HH:mm a") {
  if (date === undefined) return;
  return localizedFormat(parseISO(date), formatString);
}
