export default {
  data() {
    return {
      errorMessages: [],
      alertMessages: []
    };
  },
  computed: {
    getAlertMessages() {
      return this.alertMessages;
    },
    getErrorMessages() {
      return this.errorMessages;
    },
    valid() {
      return this.errorMessages.length === 0;
    },
    validateStartedBeforeStopped() {
      console.log("welcome to the first validation computed");
      if (this.newShift.started > this.newShift.stopped) {
        this.errorMessages.push(this.$t("shifts.errors.startedBeforeStopped"));
      }
    },
    validateMaxWorktimePerDay() {},
    validateNoSunday() {},
    validateOnlyHolidayOnHolidays() {},
    validateExclusivityVacationAndSick() {},
    validateEightTwentyRule() {},
    validateOverlapping() {}
  }
};
