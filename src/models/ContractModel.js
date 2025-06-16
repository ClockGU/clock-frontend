import is from "ramda/src/is";
import { format, differenceInCalendarDays, startOfMonth } from "date-fns";
import {
  getFirstOfCurrentMonth,
  getLastOfCurrentMonth,
  parseDate
} from "@/utils/date";
import { minutesToHHMM } from "@/utils/time";
import i18n from "@/plugins/i18n";
import { v4 as uuidv4 } from "uuid";

const { t } = i18n.global;
export function mapContractApiResponse(response) {
  return {
    id: response.id,
    user: response.user,
    name: response.name,
    reference: response.reference,
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
    worktimeModelName: response.worktime_model_name,
    percentFte: response.percent_fte
  };
}

export class Contract {
  constructor({
    id = null,
    user = null,
    name = null,
    reference = null,
    minutes = null,
    percentFte = null,
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
    this.reference = is(String, reference) ? reference : uuidv4();
    this.minutes = is(Number, minutes) ? minutes : 0;
    this.percentFte = is(Number, percentFte) ? percentFte : 0.0;
    this.startDate =
      is(Date, parseDate(startDate)) && startDate !== null
        ? parseDate(startDate)
        : getFirstOfCurrentMonth();
    this.endDate =
      is(Date, parseDate(endDate)) && endDate !== null
        ? parseDate(endDate)
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
      is(Date, parseDate(createdAt)) && createdAt !== null
        ? parseDate(createdAt)
        : new Date();
    this.color = is(String, color) ? color : "#8ac5ff";
    this.worktimeModelName = worktimeModelName;
    this.modifiedAt =
      is(Date, parseDate(modifiedAt)) && modifiedAt !== null
        ? parseDate(modifiedAt)
        : new Date();
    this.lastUsed =
      is(Date, parseDate(lastUsed)) && lastUsed !== null
        ? parseDate(lastUsed)
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
    return this.minutes/ 60;
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
  worktimeRepresentation() {
    if (this.worktimeModelName === "studEmp") {
      return t("contracts.perMonth", { time: minutesToHHMM(this.minutes) });
    }
    return t("contracts.perMonth", {
      time: t("contracts.fte", { percent: this.percentFte })
    });
  }
  toPayload() {
    return {
      id: this.id,
      name: this.name,
      reference: this.reference,
      minutes: this.minutes,
      start_date: this.startDateString(),
      end_date: this.endDateString(),
      initial_carryover_minutes: this.initialCarryoverMinutes,
      initial_vacation_carryover_minutes: this.initialVacationCarryoverMinutes,
      last_used: this.lastUsed,
      color: this.color,
      worktime_model_name: this.worktimeModelName,
      percent_fte: this.percentFte
    };
  }
  clone() {
    return new Contract(mapContractApiResponse(this.toPayload()));
  }
}

export const WORKTIME_MODEL_CHOICES = [
  { value: "studEmp", text: "", localeRef: "worktimeModelNames.studEmp" },
  { value: "regEmp", text: "", localeRef: "worktimeModelNames.regEmp" },
  { value: "civilSer", text: "", localeRef: "worktimeModelNames.civilSer" },
  { value: null, text: "", localeRef: "worktimeModelNames.notSelected" }
];
