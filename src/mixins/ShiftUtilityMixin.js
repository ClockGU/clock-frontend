import { isFuture, isWithinInterval } from "date-fns";

export default {
  computed: {
    isRunningShift() {
      return isWithinInterval(new Date(), {
        start: this.shift.started,
        end: this.shift.stopped
      });
    },
    startsInFuture() {
      return isFuture(this.shift.started);
    }
  }
};
