<template>
  <Calendar :start="start" :type="type" />
</template>

<script>
import Calendar from "@/components/Calendar";

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
      default: String(new Date().getUTCMonth())
    },
    day: {
      type: String,
      default: String(new Date().getUTCDate())
    }
  },
  created() {
    this.$store.dispatch("setCalendarDate", this.date);
    this.$store.dispatch("setCalendarType", this.type);
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
