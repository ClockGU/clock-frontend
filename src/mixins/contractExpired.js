import { endOfDay, isPast, parseISO } from "date-fns";

export default {
  computed: {
    contractExpired() {
      const date = endOfDay(parseISO(this.selectedContract.date.end));
      return isPast(date);
    },
    specificContractExpired (){
      const date = endOfDay(parseISO(this.contract.date.end));
      return isPast(date);
    }
  }
};
