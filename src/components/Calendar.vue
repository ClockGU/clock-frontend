<template>
  <v-container fluid pa-0>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <v-sheet height="100vw">
          <v-calendar
            :show-month-on-first="false"
            ref="calendar"
            color="primary"
            :locale="locale"
            :type="type"
            v-model="start"
            :end="end"
          ></v-calendar>
        </v-sheet>
      </v-flex>

      <v-flex sm4 xs12 row wrap>
        <v-btn icon @click="$refs.calendar.prev()">
          <v-icon dark left>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <span>{{ start }}</span>
        <v-btn icon @click="$refs.calendar.next()">
          <v-icon dark left>keyboard_arrow_right</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Calendar",
  data: () => ({
    type: "month",
    start: "2019-01-01",
    end: "2019-01-06",
    typeOptions: [
      { text: "Day", value: "day" },
      { text: "4 Day", value: "4day" },
      { text: "Week", value: "week" },
      { text: "Month", value: "month" },
      { text: "Custom Daily", value: "custom-daily" },
      { text: "Custom Weekly", value: "custom-weekly" }
    ],
    locale: "en-us"
  })
};
</script>
