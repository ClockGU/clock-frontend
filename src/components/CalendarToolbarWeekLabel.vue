<template>
  <v-chip v-if="showCalendarWeek" label small disabled
    >{{ calendarWeek }}
  </v-chip>
</template>

<script>
import { mapGetters } from "vuex";
import { getISOWeek } from "date-fns";

export default {
  name: "CalendarToolbarWeekLabel",
  computed: {
    showCalendarWeek() {
      return !(this.$store.state.calendar.type === "month");
    },
    calendarWeek() {
      return `Week ${getISOWeek(this.start)}`;
    },
    ...mapGetters(["start"])
  }
};
</script>
