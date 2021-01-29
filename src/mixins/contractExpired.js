import { endOfDay, isPast, parseISO } from "date-fns";

export default {
  computed: {
    contractExpired() {
      return this.specificContractExpired(this.selectedContract)
    }
  },
  methods: {
    specificContractExpired (contract){
      const date = endOfDay(parseISO(contract.date.end));
      return isPast(date)
    }
  }
};
