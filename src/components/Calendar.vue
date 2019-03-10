<template>
  <v-container fluid pa-0>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <v-sheet height="100vw">
          <v-calendar
            ref="calendar"
            color="primary"
            @click:date="changeDate"
            :show-month-on-first="false"
            :locale="locale"
            :type="type"
            :start="start"
            :end="end"
          ></v-calendar>
        </v-sheet>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Calendar",
  data: () => ({
    end: "2019-01-06",
    typeOptions: [
      { text: "Day", value: "day" },
      { text: "4 Day", value: "4day" },
      { text: "Week", value: "week" },
      { text: "Month", value: "month" },
      { text: "Custom Daily", value: "custom-daily" },
      { text: "Custom Weekly", value: "custom-weekly" }
    ]
  }),
  computed: {
    ...mapGetters(["start", "type", "locale"])
  },
  methods: {
    changeDate(payload) {
      this.$store.dispatch("setCalendarDate", new Date(payload.date));
      this.$store.dispatch("setCalendarType", "day");
    }
  }
};
</script>
