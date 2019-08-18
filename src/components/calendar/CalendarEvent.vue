<template>
  <v-layout wrap>
    <v-flex xs12>Start: {{ start }}</v-flex>
    <v-flex xs12>End: {{ end }}</v-flex>
    <v-flex xs12>Duration: {{ event.duration }}</v-flex>
  </v-layout>
</template>

<script>
import { format } from "date-fns";

export default {
  name: "CalendarEvent",
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  computed: {
    start() {
      return format(this.event.dates.start, "YYYY-MM-DD HH:mm");
    },
    end() {
      return format(this.event.dates.end, "YYYY-MM-DD HH:mm");
    }
  }
};
</script>
