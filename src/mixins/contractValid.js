import {
  endOfDay,
  isFuture,
  isPast,
  isWithinInterval,
  startOfDay
} from "date-fns";

export default {
  computed: {
    contractExpired() {
      if (this.selectedContract === undefined) return false;
      return this.specificContractExpired(this.selectedContract);
    },
    contractValid() {
      if (this.selectedContract === undefined) return false;
      return this.specificContractValid(this.selectedContract);
    },
    contractInFuture() {
      if (this.selectedContract === undefined) return false;
      return this.specificContractInFuture(this.selectedContract);
    }
  },
  methods: {
    specificContractExpired(contract) {
      const date = endOfDay(contract.endDate);
      return isPast(date) && contract.id !== null;
    },
    specificContractValid(contract) {
      const startdate = startOfDay(contract.startDate);
      const enddate = endOfDay(contract.endDate);
      return (
        isWithinInterval(new Date(), { start: startdate, end: enddate }) &&
        contract.id !== null
      );
    },
    specificContractInFuture(contract) {
      const date = startOfDay(contract.startDate);
      return isFuture(date) && contract.id !== null;
    }
  }
};
