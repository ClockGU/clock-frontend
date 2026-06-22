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
      return this.specificContractExpired(this.selectedContract);
    },
    contractValid() {
      return this.specificContractValid(this.selectedContract);
    },
    contractInFuture() {
      return this.specificContractInFuture(this.selectedContract);
    }
  },
  methods: {
    specificContractUndefined(contract) {
      return contract === undefined;
    },
    specificContractExpired(contract) {
      return (
        !this.specificContractUndefined(contract) &&
        isPast(endOfDay(contract.endDate)) &&
        contract.id !== null
      );
    },
    specificContractValid(contract) {
      return (
        !this.specificContractUndefined(contract) &&
        isWithinInterval(new Date(), {
          start: startOfDay(contract.startDate),
          end: endOfDay(contract.endDate)
        }) &&
        contract.id !== null
      );
    },
    specificContractInFuture(contract) {
      return (
        !this.specificContractUndefined(contract) &&
        isFuture(startOfDay(contract.startDate)) &&
        contract.id !== null
      );
    }
  }
};
