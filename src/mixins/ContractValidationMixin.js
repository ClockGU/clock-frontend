import { useVuelidate } from "@vuelidate/core";
import store from "@/store";

export default {
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  computed: {
    errorMessages() {
      let errorMessages = [];
      errorMessages.push(this.validateStartDate);
      return errorMessages.filter((message) => message !== undefined);
    },
    valid() {
      return (
        !this.v$.$silentErrors.length > 0 || this.errorMessages.length === 0
      );
    },
    validateStartDate() {
      let shifts = this.shiftsThisReport;
      console.log("this.newContract.startDate: " + this.newContract.startDate);
      for (var shift of shifts) {
        console.log("shift.started: " + shift.started);
        if (this.newContract.startDate > shift.started) {
          console.log("Start date cannot be after an existing shift");
          return "Start date cannot be after an existing shift";
        }
      }
    },
    reportsThisContract() {
      let reportsOfThisContract =
        store.getters["contentData/getReportsFromContract"];
      console.log("reportsOfThisContract: " + reportsOfThisContract);
      return reportsOfThisContract;
    },
    shiftsThisReport() {
      let allShiftsByThisUser = store.getters["contentData/allShifts"].filter(
        (shift) => {
          return shift.contract === this.newContract.id;
        }
      );
      console.log("allShiftsByThisUser: " + allShiftsByThisUser);
      return allShiftsByThisUser;
    }
  }
};
