<template>
  <div>
    <Calendar :start="start" :type="type"></Calendar>
    <portal to="toolbar">
      <CalendarToolbar />
    </portal>
    <portal to="fab">
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="pink"
        :to="{ name: 'createShift' }"
      >
        <v-icon>add</v-icon>
      </v-btn>
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
  computed: {
    date() {
      return new Date(Date.UTC(this.year, this.month - 1, this.day));
    },
    start() {
      return this.date.toISOString().slice(0, 10);
    }
  },
  created() {
    this.$store.dispatch("calendar/setDate", this.date);
    this.$store.dispatch("calendar/setType", this.type);
  }
};
</script>
