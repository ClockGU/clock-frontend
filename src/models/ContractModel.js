import is from "ramda/src/is";
import { format, differenceInCalendarDays, startOfMonth } from "date-fns";

export function mapContractApiResponse(response) {
  return {
    id: response.id,
    user: response.user,
    name: response.name,
    minutes: response.minutes,
    startDate: response.start_date,
    endDate: response.end_date,
    initialCarryoverMinutes: response.initial_carryover_minutes,
    carryoverTargetDate: response.carryover_target_date,
    createdAt: response.created_at,
    modifiedAt: response.modified_at,
    lastUsed: response.last_used
  };
}

export class Contract {
  constructor({
    id = null,
    user = null,
    name = null,
    minutes = null,
    startDate = null,
    endDate = null,
    initialCarryoverMinutes = null,
    carryoverTargetDate = null,
    createdAt = null,
    modifiedAt = null,
    lastUsed = null
  } = {}) {
    this.id = is(String, id) ? id : null;
    this.user = is(String, user) ? user : null;
    this.name = is(String, name) ? name : null;
    this.minutes = is(Number, minutes) ? minutes : 0;
    this.startDate = is(Date, new Date(startDate)) ? new Date(startDate) : null;
    this.endDate = is(Date, new Date(endDate)) ? new Date(endDate) : null;
    this.initialCarryoverMinutes = is(Number, initialCarryoverMinutes)
      ? initialCarryoverMinutes
      : 0;
    this.carryoverTargetDate =
      is(Date, new Date(carryoverTargetDate)) && carryoverTargetDate !== null
        ? new Date(carryoverTargetDate)
        : startOfMonth(this.startDate);
    this.createdAt =
      is(Date, new Date(createdAt)) && createdAt !== null
        ? new Date(createdAt)
        : null;
    this.modifiedAt =
      is(Date, new Date(modifiedAt)) && modifiedAt !== null
        ? new Date(modifiedAt)
        : null;
    this.lastUsed =
      is(Date, new Date(lastUsed)) && lastUsed !== null
        ? new Date(lastUsed)
        : null;
  }

  get duration() {
    return differenceInCalendarDays(this.endDate, this.startDate);
  }

  get remainingContractDuration() {
    return differenceInCalendarDays(this.endDate, new Date());
  }

  get minutesToHourRepresentation() {
    // Getter converting minutes into decimal representation of hours
    const remainingMinutes = this.minutes % 60;
    const fullHours = this.minutes - remainingMinutes;
    return fullHours + remainingMinutes / 60;
  }

  CarryoverTargetDateString() {
    return format(startOfMonth(this.carryoverTargetDate), "yyyy-MM-dd");
  }
  startDateString() {
    return format(startOfMonth(this.startDate), "yyyy-MM-dd");
  }

  endDateString() {
    return format(startOfMonth(this.endDate), "yyyy-MM-dd");
  }

  toPayload() {
    return {
      name: this.name,
      minutes: this.minutes,
      start_date: this.startDateString(),
      end_date: this.endDateString(),
      carryover_target_date: this.CarryoverTargetDateString(),
      initial_carryover_minutes: this.initialCarryoverMinutes
    };
  }
}
