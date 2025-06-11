import is from "ramda/src/is";
import { timestringToMinutes } from "@/utils/time";
import { parseDate } from "@/utils/date";

export function mapReportApiResponse(response) {
  return {
    id: response.id,
    debitWorktime: response.debit_worktime,
    worktime: response.worktime,
    carryoverPreviousMonth: response.carryover_previous_month,
    carryover: response.carryover,
    debitVacationTime: response.debit_vacation_time,
    vacationTime: response.vacation_time,
    vacationCarryoverPreviousMonth: response.vacation_carryover_previous_month,
    vacationCarryoverNextMonth: response.vacation_carryover_next_month,
    monthYear: response.month_year,
    createdAt: response.created_at,
    modifiedAt: response.modified_at,
    contract: response.contract
  };
}

export class Report {
  constructor({
    id = null,
    debitWorktime = null,
    worktime = null,
    carryoverPreviousMonth = null,
    carryover = null,
    debitVacationTime = null,
    vacationTime = null,
    vacationCarryoverPreviousMonth = null,
    vacationCarryoverNextMonth = null,
    monthYear = null,
    createdAt = null,
    modifiedAt = null,
    contract = null
  } = {}) {
    this.id = is(String, id) ? id : null;
    this.debitWorktime = is(String, debitWorktime) ? debitWorktime : null;
    this.worktime = is(String, worktime) ? worktime : null;
    this.carryOverPreviousMonth = is(String, carryoverPreviousMonth)
      ? carryoverPreviousMonth
      : null;
    this.carryover = is(String, carryover) ? carryover : null;
    this.debitVacationTime = is(String, debitVacationTime)
      ? debitVacationTime
      : null;
    this.vacationTime = is(String, vacationTime) ? vacationTime : null;
    this.vacationCarryoverPreviousMonth = is(
      String,
      vacationCarryoverPreviousMonth
    )
      ? vacationCarryoverPreviousMonth
      : null;
    this.vacationCarryoverNextMonth = is(String, vacationCarryoverNextMonth)
      ? vacationCarryoverNextMonth
      : null;
    this.monthYear = is(Date, parseDate(monthYear))
      ? parseDate(monthYear)
      : null;
    this.createdAt = is(Date, parseDate(createdAt))
      ? parseDate(createdAt)
      : null;
    this.modifiedAt = is(Date, parseDate(modifiedAt))
      ? parseDate(modifiedAt)
      : null;
    this.contract = is(String, contract) ? contract : null;
  }

  get debitWorktimeInMinutes() {
    return timestringToMinutes(this.debitWorktime);
  }
  get worktimeInMinutes() {
    return timestringToMinutes(this.worktime);
  }
  get carryoverPreviousMonthInMinutes() {
    return timestringToMinutes(this.carryOverPreviousMonth);
  }
  get carryoverInMinutes() {
    return timestringToMinutes(this.carryover);
  }
  toPayload() {
    throw new Error("Sending report data is not allowed.");
  }
}
