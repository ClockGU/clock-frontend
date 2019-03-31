<template>
  <div>
    <calendar :start="start" :type="type"> </calendar>
    <portal to="toolbar">
      <calendar-toolbar />
    </portal>
  </div>
</template>

<script>
import Calendar from "@/components/calendar/Calendar";

import CalendarToolbar from "@/components/calendar/CalendarToolbar";

export default {
  components: {
    Calendar,
    CalendarToolbar
  },
  props: {
    type: {
      type: String,
      default: "month"
    },
    year: {
      type: String,
      default: String(new Date().getUTCFullYear())
    },
    month: {
      type: String,
      default: String(new Date().getUTCMonth() + 1)
    },
    day: {
      type: String,
      default: String(new Date().getUTCDate())
    }
  },
  created() {
    this.$store.dispatch("calendar/setDate", this.date);
    this.$store.dispatch("calendar/setType", this.type);
  },
  computed: {
    date() {
      return new Date(Date.UTC(this.year, this.month - 1, this.day));
    },
    start() {
      return this.date.toISOString().slice(0, 10);
    }
  }
};
</script>
