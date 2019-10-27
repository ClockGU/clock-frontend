<template>
  <v-date-picker
    v-model="date"
    event-color="blue"
    :events="events"
    full-width
    no-title
  ></v-date-picker>
</template>

<script>
import { mapGetters } from "vuex";
import { format, parseISO } from "date-fns";

export default {
  name: "DashboardCalendar",
  data() {
    return {
      date: new Date().toISOString().substr(0, 10)
    };
  },
  computed: {
    ...mapGetters({
      shifts: "shift/shifts",
      contract: "selectedContract"
    }),
    events() {
      return this.shifts.map(shift =>
        format(parseISO(shift.date.start), "yyyy-MM-dd")
      );
    }
  }
};
</script>
