<template>
  <Calendar :start="start" :type="type" />
</template>

<script>
import Calendar from "@/components/calendar/Calendar";

export default {
  components: {
    Calendar
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
