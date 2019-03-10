<template>
  <v-layout align-center row>
    <v-btn outline @click="setToday()">Today</v-btn>
    <calendar-toolbar-navigation-buttons />
    <calendar-toolbar-date-picker />
    <v-select v-model="type" :items="types"></v-select>
  </v-layout>
</template>

<script>
import CalendarToolbarDatePicker from "@/components/CalendarToolbarDatePicker";
import CalendarToolbarNavigationButtons from "@/components/CalendarToolbarNavigationButtons";

export default {
  name: "CalendarToolbar",
  components: { CalendarToolbarNavigationButtons, CalendarToolbarDatePicker },
  data: () => ({
    drawer: null,
    types: [
      { text: "Day", value: "day" },
      { text: "Week", value: "week" },
      { text: "Month", value: "month" }
    ]
  }),
  computed: {
    type: {
      get() {
        return this.types.filter(
          type => type.value == this.$store.state.calendar.type
        )[0];
      },
      set(type) {
        this.$store.dispatch("setCalendarType", type);
      }
    }
  },
  methods: {
    setToday() {
      this.$store.dispatch("setCalendarDate", new Date());
    }
  }
};
</script>
