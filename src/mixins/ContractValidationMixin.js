import store from "@/store";

export default {
  computed: {
    errorMessages() {
      let errorMessages = [];
      errorMessages.push(this.validateDurationAndExistingShifts);
      errorMessages.push(undefined);
      return errorMessages.filter((message) => message !== undefined);
    },
    valid() {
      return (
        !this.v$.$silentErrors.length > 0 && this.errorMessages.length === 0
      );
    },
    validateDurationAndExistingShifts() {
      let shifts = this.shiftsThisContract;
      for (var shift of shifts) {
        if (this.newContract.startDate > shift.started) {
          return "Start date cannot be after an existing shift";
        }
        if (this.newContract.endDate < shift.stopped) {
          return "End Date cannot be before an existing shift";
        }
      }
    },
    reportsThisContract() {
      return store.getters["contentData/getReportsFromContract"];
    },
    shiftsThisContract() {
      return store.getters["contentData/allShifts"].filter((shift) => {
        return shift.contract === this.newContract.id;
      });
    }
  }
};
