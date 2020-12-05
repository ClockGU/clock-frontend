// import { isPast, parseISO } from "date-fns";

export default {
  computed: {
    contractExpired() {
      return false;
      // return isPast(parseISO(this.selectedContract.date.end));
    }
  }
};
