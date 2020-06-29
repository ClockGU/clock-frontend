import { format, parseISO } from "date-fns";

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

export function minutesToHHMM(min, format) {
  const hours = Math.floor(min / 60).pad(2);
  const minutes = (min % 60).pad(2);

  return format === "hm" ? `${hours}h ${minutes}m` : `${hours}:${minutes}`;
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
  return format(parseISO(date), formatString);
}

export function formatTime(date, formatString = "HH:mm a") {
  if (date === undefined) return;
  return format(parseISO(date), formatString);
}
