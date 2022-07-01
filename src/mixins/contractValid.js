import {
  endOfDay,
  isFuture,
  isPast,
  isWithinInterval,
  parseISO,
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
    specificContractExpired(contract) {
      const date = endOfDay(parseISO(contract.date.end));
      return isPast(date) && contract.uuid !== null;
    },
    specificContractValid(contract) {
      const startdate = endOfDay(parseISO(contract.date.start));
      const enddate = endOfDay(parseISO(contract.date.end));
      return (
        isWithinInterval(new Date(), { start: startdate, end: enddate }) &&
        contract.uuid !== null
      );
    },
    specificContractInFuture(contract) {
      const date = startOfDay(parseISO(contract.date.start));
      return isFuture(date) && contract.uuid !== null;
    }
  }
};
