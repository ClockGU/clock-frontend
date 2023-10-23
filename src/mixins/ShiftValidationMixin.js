import store from "@/store";
import { dateIsHoliday } from "@/utils/date";
import isSameDay from "date-fns/isSameDay";
import { isSameMonth } from "date-fns";
import { useVuelidate } from "@vuelidate/core";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  computed: {
    alertMessages() {
      let alertMessages = [];
      alertMessages.push(this.checkEightTwentyRule);
      alertMessages.push(this.validateNoSunday);
      alertMessages.push(this.checkAutomaticWorktimeCutting);
      return alertMessages.filter((message) => message !== undefined);
    },
    errorMessages() {
      let errorMessages = [];
      errorMessages.push(this.validateStartedBeforeStopped);
      errorMessages.push(this.validateMaxWorktimePerDay);
      errorMessages.push(this.validateOnlyHolidayOnHolidays);
      errorMessages.push(this.validateHolidayOnWorkdays);
      errorMessages.push(this.validateExclusivityVacation);
      errorMessages.push(this.validateExclusivitySick);
      errorMessages.push(this.validateOverlapping);
      errorMessages.push(this.validateInLockedMonth);
      return errorMessages.filter((message) => message !== undefined);
    },
    valid() {
      return this.errorMessages.length === 0 && !this.v$.$error;
    },
    validateStartedBeforeStopped() {
      if (this.newShift.started > this.newShift.stopped) {
        return this.$t("shifts.errors.startedBeforeStopped");
      }
    },
    validateMaxWorktimePerDay() {
      var newShiftWorktime =
        (this.newShift.stopped - this.newShift.started) / 60000;
      var totalWorktime = newShiftWorktime + this.alreadyClockedWorktime;
      if (6 * 60 < totalWorktime && totalWorktime <= 9 * 60) {
        if (this.totalBreaktime < 30) {
          newShiftWorktime = newShiftWorktime - 30 + this.totalBreaktime;
        }
      } else if (totalWorktime > 9 * 60) {
        if (this.totalBreaktime < 45) {
          newShiftWorktime = newShiftWorktime - 45 + this.totalBreaktime;
        }
      }
      if (newShiftWorktime + this.alreadyClockedWorktime > 10 * 60) {
        return this.$t("shifts.errors.maximumWorktimePerDay");
      }
    },
    validateNoSunday() {
      if (this.newShift.started.getDay() === 0) {
        return this.$t("shifts.errors.workingOnSundays");
      }
    },
    validateOnlyHolidayOnHolidays() {
      if (dateIsHoliday(this.newShift.started) && this.newShift.type !== "bh") {
        return this.$t("shifts.errors.workingOnHolidays");
      }
    },
    validateHolidayOnWorkdays() {
      if (
        this.newShift.type === "bh" &&
        !dateIsHoliday(this.newShift.started)
      ) {
        return this.$t("shifts.errors.holidayOnWorkday");
      }
    },
    validateExclusivityVacation() {
      if (
        (this.newShift.type === "vn" &&
          this.shiftsThisDay.some((shift) => shift.type !== "vn")) ||
        (this.newShift.type === "st" &&
          this.shiftsThisDay.some((shift) => shift.type === "vn"))
      ) {
        return this.$t("shifts.errors.exclusiveVacation");
      }
    },
    validateExclusivitySick() {
      if (
        (this.newShift.type === "sk" &&
          this.shiftsThisDay.some((shift) => shift.type !== "sk")) ||
        (this.newShift.type === "st" &&
          this.shiftsThisDay.some((shift) => shift.type === "sk"))
      ) {
        return this.$t("shifts.errors.exclusiveSick");
      }
    },
    validateOverlapping() {
      for (let shift of this.shiftsThisDay) {
        if (
          shift.started <= this.newShift.started &&
          this.newShift.started < shift.stopped
        ) {
          return this.$t("shifts.errors.overlappingStarted");
        }
        if (
          shift.started < this.newShift.stopped &&
          this.newShift.stopped <= shift.stopped
        ) {
          return this.$t("shifts.errors.overlappingStopped");
        }
      }
    },
    validateInLockedMonth() {
      if (
        this.shiftsThisMonth.filter((shift) => shift.locked === true).length
      ) {
        return this.$t("shifts.errors.month_already_locked");
      }
    },
    checkEightTwentyRule() {
      if (
        this.newShift.started.getHours() < 8 ||
        this.newShift.stopped.getHours() > 20
      ) {
        return this.$t("shifts.errors.eightTwentyRule");
      }
    },
    checkAutomaticWorktimeCutting() {
      var newShiftWorktime =
        (this.newShift.stopped - this.newShift.started) / 60000;
      var totalWorktime = newShiftWorktime + this.alreadyClockedWorktime;
      if (
        (totalWorktime > 9 * 60 && this.totalBreaktime < 45) ||
        (totalWorktime <= 9 * 60 &&
          totalWorktime > 6 * 60 &&
          this.totalBreaktime < 30)
      ) {
        return this.$t("shifts.errors.autoWorktimeCutting");
      }
    },
    shiftsThisDay() {
      return store.getters["contentData/allShifts"].filter((shift) => {
        return (
          isSameDay(shift.started, this.newShift.started) &&
          shift.wasReviewed &&
          shift.id !== this.newShift.id
        );
      });
    },
    shiftsThisMonth() {
      return store.getters["contentData/selectedShifts"].filter((shift) => {
        return (
          isSameMonth(shift.started, this.newShift.started) &&
          shift.wasReviewed &&
          shift.id !== this.newShift.id
        );
      });
    },
    alreadyClockedWorktime() {
      var workMinutesThisDay = 0;
      if (this.shiftsThisDay.length > 0) {
        workMinutesThisDay = this.shiftsThisDay.reduce(
          (workMinutes, shift) =>
            workMinutes + (shift.stopped - shift.started) / 60000,
          0
        );
      }
      return workMinutesThisDay;
    },
    totalBreaktime() {
      if (!this.shiftsThisDay.length) {
        return 0;
      }
      let total_break = 0;
      for (var i = 0; i < this.shiftsThisDay.length - 1; i++) {
        var currentShift = this.shiftsThisDay[i];
        var nextShift = this.shiftsThisDay[i + 1];
        total_break = total_break + (nextShift.started - currentShift.stopped);
      }
      // new shift is after old shifts
      if (
        this.newShift.started >=
        this.shiftsThisDay[this.shiftsThisDay.length - 1].stopped
      )
        return (
          (this.newShift.started -
            this.shiftsThisDay[this.shiftsThisDay.length - 1].stopped +
            total_break) /
          60000
        );
      // new shift is before old shifts
      if (this.newShift.stopped <= this.shiftsThisDay[0].started)
        return (
          (this.shiftsThisDay[0].started -
            this.newShift.stopped +
            total_break) /
          60000
        );

      // new shift is in between old shifts
      return (
        (total_break - (this.newShift.stopped - this.newShift.started)) / 60000
      );
    }
  }
};
