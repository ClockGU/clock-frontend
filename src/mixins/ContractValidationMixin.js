import store from "@/store";
import { endOfDay, startOfDay } from "date-fns";
export default {
  computed: {
    errorMessages() {
      let errorMessages = [];
      errorMessages.push(this.validateDurationAndExistingShifts);
      errorMessages.push(this.validatePositiveWorktime);
      errorMessages.push(this.validateNoCarryoverForFutureContracts);
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
        if (
          startOfDay(this.newContract.startDate) > shift.started ||
          endOfDay(this.newContract.endDate) < shift.stopped
        ) {
          return this.$t("contracts.errors.shiftOutOfScope");
        }
      }
    },
    validatePositiveWorktime() {
      if (this.newContract.worktimeModelName === "studEmp") {
        if (this.newContract.minutes <= 0) {
          return this.$t("contracts.errors.worktimeMustBePositive");
        }
      } else if (this.newContract.worktimeModelName !== null) {
        if (this.newContract.percentFte <= 0) {
          return this.$t("contracts.errors.worktimeMustBePositive");
        }
      }
    },
    validateNoCarryoverForFutureContracts() {
      const today = new Date();
      if (
        this.newContract.startDate > today &&
        this.newContract.initialCarryoverMinutes !== 0
      ) {
        return this.$t("contracts.errors.carryoverForFutureContracts");
      }
    },
    shiftsThisContract() {
      return store.getters["contentData/allShifts"].filter((shift) => {
        return shift.contract === this.newContract.id;
      });
    }
  }
};
