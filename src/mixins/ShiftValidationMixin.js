import Holidays from "date-holidays";

export default {
  computed: {
    getAlertMessages() {
      let alertMessages = [];
      return alertMessages;
    },
    getErrorMessages() {
      let errorMessages = [];
      errorMessages.push(this.validateStartedBeforeStopped);
      errorMessages.push(this.validateOnlyHolidayOnHolidays);
      return errorMessages.filter((message) => message != undefined);
    },
    valid() {
      return this.errorMessages.length === 0;
    },
    validateStartedBeforeStopped() {
      if (this.newShift != undefined) {
        if (this.newShift.started > this.newShift.stopped) {
          return this.$t("shifts.errors.startedBeforeStopped");
        }
      }
    },
    validateMaxWorktimePerDay() {},
    validateNoSunday() {},
    validateOnlyHolidayOnHolidays() {
      if (this.newShift != undefined) {
        if (this.dateIsHoliday & (this.newShift.type !== "bh")) {
          return this.$t("shifts.errors.workingOnHolidays");
        }
      }
    },
    validateExclusivityVacationAndSick() {},
    validateEightTwentyRule() {},
    validateOverlapping() {},
    shiftsThisDay() {},
    dateIsHoliday() {
      // Christmas Eve and New Year's Eve are considered half Bank holidays
      // by the date-holidays package.
      // So we need to treat it separately
      const date = this.newShift.started;

      if (
        date.getMonth() === 11 &&
        (date.getDate() === 24 || date.getDate() === 31)
      ) {
        return true;
      }
      const hd = new Holidays("DE", "HE");
      const holidayCandidate = hd.isHoliday(date); // returns false or array ... strange
      if (!holidayCandidate) {
        return holidayCandidate;
      }
      return (
        holidayCandidate[0].type === "public" ||
        holidayCandidate[0].type === "bank"
      );
    }
  }
};
