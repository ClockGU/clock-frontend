import { dateIsHoliday } from "@/utils/date";
import { formatISO, isSameDay, parseISO } from "date-fns";
import { coalescWorktimeAndBreaktime, minutesToHHMM } from "@/utils/time";
import {
  enoughBreaktimeBetweenShifts,
  maxWorktimeExceeded,
  missingBreaktime
} from "@/utils/shift";

export default {
  computed: {
    selectedDateIsHoliday() {
      if (this.shift === null) return false;
      return dateIsHoliday(this.shift.date.start);
    },
    contractShifts() {
      return this.$store.getters["shift/shifts"].filter((shift) => {
        return shift.contract === this.shift.contract;
      });
    },
    shiftsOnSelectedDate() {
      return this.contractShifts.filter((shift) => {
        return isSameDay(parseISO(shift.date.start), this.shift.date.start);
      });
    },
    sickOrVacationShifts() {
      if (this.shift === null) return [];
      return this.shiftsOnSelectedDate.filter((shift) => {
        return shift.type === "vn" || shift.type === "sk";
      });
    },
    multipleRegularShiftsExistOnDate() {
      return (
        this.shiftsOnSelectedDate.length >= 1 &&
        this.sickOrVacationShifts.length === 0 &&
        this.uuid === null
      );
    },
    worktimeAndBreaktimeOnDate() {
      const formattedDate = {
        start: formatISO(this.shift.date.start),
        end: formatISO(this.shift.date.end)
      };
      // Copy Array
      let shifts = this.shiftsOnSelectedDate.concat([]);
      const indexOfShift = shifts.findIndex(
        (shift) => shift.uuid === this.uuid
      );
      if (indexOfShift === -1) {
        return coalescWorktimeAndBreaktime(
          shifts.concat([{ date: formattedDate }]) // this is a Hack, only passing an object with a date key.
        );
      }
      // Update the shift's date to current date
      shifts[indexOfShift].date = formattedDate;
      return coalescWorktimeAndBreaktime(shifts);
    },
    enoughBreaktime() {
      return enoughBreaktimeBetweenShifts(this.worktimeAndBreaktimeOnDate);
    },
    worktimeTooLong() {
      return maxWorktimeExceeded(this.worktimeAndBreaktimeOnDate.worktime);
    },
    alertMessages() {
      let messages = [];
      if (this.selectedDateIsHoliday) {
        messages.push(this.$t("shifts.warnings.selectedDateIsHoliday"));
      }
      if (this.sickOrVacationShifts.length >= 1 && this.uuid === null) {
        messages.push(
          this.$t("shifts.warnings.sickOrVacationShiftExists", {
            shiftType: this.$t(
              `shifts.types.${this.sickOrVacationShifts[0].type}`
            )
          })
        );
      }
      return messages;
    },
    errorMessages() {
      let messages = [];
      if (this.shift === null) return messages;
      if (
        this.multipleRegularShiftsExistOnDate &&
        (this.shift.type.value === "vn" || this.shift.type.value === "sk")
      ) {
        messages.push(
          this.$t("shifts.warnings.noSickOrVacationWithRegularShift", {
            shiftType: this.$t(`shifts.types.${this.shift.type.value}`)
          })
        );
      }
      if (!this.enoughBreaktime && !this.splitWithBreaktime) {
        messages.push(
          this.$t("shifts.warnings.notEnoughBreaktime", {
            worktime: minutesToHHMM(this.worktimeAndBreaktimeOnDate.worktime),
            breaktime: minutesToHHMM(this.worktimeAndBreaktimeOnDate.breaktime)
          })
        );
      }

      if (this.worktimeTooLong) {
        messages.push(this.$t("shifts.warnings.maxWorktimeExceeded"));
      }

      return messages;
    },
    messages() {
      return this.errorMessages.concat(this.alertMessages);
    },
    alertType() {
      // Prioritize Errors
      if (this.errorMessages.length !== 0) {
        return "error";
      }
      return "warning";
    }
  },
  watch: {
    messages: {
      handler: function (newValue) {
        if (newValue.length === 0 && this.shift !== null) {
          this.shift.type = this.initialShiftType;
        }
      }
    },
    splitWithBreaktime: {
      handler: function () {
        if (this.splitWithBreaktime) {
          const splitDuration = Math.floor(this.shift.duration / 2);
          const remainder = this.shift.duration % 2;
          this.$emit("update", {
            shift: this.shift,
            valid: this.valid,
            splitData: {
              splitDuration: splitDuration + remainder,
              breaktime: missingBreaktime(this.worktimeAndBreaktimeOnDate)
            }
          });
        }
        this.$emit("update", { shift: this.shift, valid: this.valid });
      }
    }
  },
  methods: {}
};
