<template>
  <v-container fluid pa-0>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <v-sheet height="100vh">
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
    end: "2019-01-06"
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
