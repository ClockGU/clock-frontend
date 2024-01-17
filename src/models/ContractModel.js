import is from "ramda/src/is";
import { format, differenceInCalendarDays, startOfMonth } from "date-fns";
import { getFirstOfCurrentMonth, getLastOfCurrentMonth } from "@/utils/date";

import i18n from "@/plugins/i18n";

const { t } = i18n.t;

export function mapContractApiResponse(response) {
  return {
    id: response.id,
    user: response.user,
    name: response.name,
    minutes: response.minutes,
    startDate: response.start_date,
    endDate: response.end_date,
    initialCarryoverMinutes: response.initial_carryover_minutes,
    initialVacationCarryoverMinutes:
      response.initial_vacation_carryover_minutes,
    createdAt: response.created_at,
    modifiedAt: response.modified_at,
    lastUsed: response.last_used,
    color: response.color,
    worktimeModelName: response.worktime_model_name
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
    initialVacationCarryoverMinutes = null,
    createdAt = null,
    modifiedAt = null,
    lastUsed = null,
    color = null,
    worktimeModelName = null
  } = {}) {
    this.id = is(String, id) ? id : "";
    this.user = is(String, user) ? user : "";
    this.name = is(String, name) ? name : "";
    this.minutes = is(Number, minutes) ? minutes : 0;
    this.startDate =
      is(Date, new Date(startDate)) && startDate !== null
        ? new Date(startDate)
        : getFirstOfCurrentMonth();
    this.endDate =
      is(Date, new Date(endDate)) && endDate !== null
        ? new Date(endDate)
        : getLastOfCurrentMonth();
    this.initialCarryoverMinutes = is(Number, initialCarryoverMinutes)
      ? initialCarryoverMinutes
      : 0;
    this.initialVacationCarryoverMinutes = is(
      Number,
      initialVacationCarryoverMinutes
    )
      ? initialVacationCarryoverMinutes
      : 0;
    this.createdAt =
      is(Date, new Date(createdAt)) && createdAt !== null
        ? new Date(createdAt)
        : new Date();
    this.color = is(String, color) ? color : "#8ac5ff";
    this.worktimeModelName = worktimeModelName;
    this.modifiedAt =
      is(Date, new Date(modifiedAt)) && modifiedAt !== null
        ? new Date(modifiedAt)
        : new Date();
    this.lastUsed =
      is(Date, new Date(lastUsed)) && lastUsed !== null
        ? new Date(lastUsed)
        : new Date();
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
    return format(this.startDate, "yyyy-MM-dd");
  }

  endDateString() {
    return format(this.endDate, "yyyy-MM-dd");
  }
  toPayload() {
    return {
      id: this.id,
      name: this.name,
      minutes: this.minutes,
      start_date: this.startDateString(),
      end_date: this.endDateString(),
      initial_carryover_minutes: this.initialCarryoverMinutes,
      initial_vacation_carryover_minutes: this.initialVacationCarryoverMinutes,
      last_used: this.lastUsed,
      color: this.color,
      worktime_model_name: this.worktimeModelName
    };
  }
  clone() {
    return new Contract(mapContractApiResponse(this.toPayload()));
  }
}

export const WORKTIME_MODEL_CHOICES = [
  { value: "studEmp", text: t("worktimeModelNames.studEmp") }
];
