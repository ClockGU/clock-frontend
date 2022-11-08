import is from "ramda/src/is";
import { timestringToMinutes } from "@/utils/time";

export function mapReportApiResponse(response) {
  return {
    id: response.id,
    debitWorktime: response.debit_worktime,
    worktime: response.worktime,
    carryoverPreviousMonth: response.carryover_previous_month,
    carryover: response.carryover,
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
    this.monthYear = is(Date, new Date(monthYear)) ? new Date(monthYear) : null;
    this.createdAt = is(Date, new Date(createdAt)) ? new Date(createdAt) : null;
    this.modifiedAt = is(Date, new Date(modifiedAt))
      ? new Date(modifiedAt)
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
