import Holidays from "date-holidays";
import store from "@/store";

export default {
  computed: {
    getAlertMessages() {
      let alertMessages = [];
      alertMessages.push(this.validateEightTwentyRule);
      return alertMessages.filter((message) => message != undefined);
    },
    getErrorMessages() {
      let errorMessages = [];
      errorMessages.push(this.validateStartedBeforeStopped);
      errorMessages.push(this.validateMaxWorktimePerDay);
      errorMessages.push(this.validateNoSunday);
      errorMessages.push(this.validateOnlyHolidayOnHolidays);
      errorMessages.push(this.validateExclusivityVacationAndSick);
      errorMessages.push(this.validateOverlapping);
      return errorMessages.filter((message) => message != undefined);
    },
    valid() {
      return this.getErrorMessages.length === 0;
    },
    validateStartedBeforeStopped() {
      if (this.newShift.started > this.newShift.stopped) {
        return this.$t("shifts.errors.startedBeforeStopped");
      }
    },
    validateMaxWorktimePerDay() {},
    validateNoSunday() {
      if (this.newShift.started.getDay() === 0) {
        return this.$t("shifts.errors.workingOnSundays");
      }
    },
    validateOnlyHolidayOnHolidays() {
      if (this.dateIsHoliday & (this.newShift.type !== "bh")) {
        return this.$t("shifts.errors.workingOnHolidays");
      }
    },
    validateExclusivityVacationAndSick() {},
    validateEightTwentyRule() {
      if (
        this.newShift.started.getHours() < 8 ||
        this.newShift.stopped.getHours() > 20
      ) {
        return this.$t("shifts.errors.eightTwentyRule");
      }
    },
    validateOverlapping() {},
    shiftsThisDay() {
      let checkoutUser = store.getters["auth/checkoutUser"];
      console.log("checkoutUser: " + checkoutUser);
      let newShiftUser = this.newShift.user;
      console.log("newShiftUser: " + newShiftUser);
      let allShiftsByThisUser = store.getters["contentData/allShifts"].filter(
        (shift) => {
          return (
            shift.user === newShiftUser &&
            shift.started.date === this.newShift.started.date &&
            shift.was_reviewed
          );
        }
      );
      console.log(allShiftsByThisUser);
      return allShiftsByThisUser;
    },
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
