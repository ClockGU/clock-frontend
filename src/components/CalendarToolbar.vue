<template>
  <v-layout align-center row>
    <v-btn outline @click="setToday()">Today</v-btn>
    <calendar-toolbar-navigation-buttons />
    <calendar-toolbar-date-picker />
    <calendar-toolbar-week-label />
    <v-spacer></v-spacer>
    <calendar-toolbar-type-select />
  </v-layout>
</template>

<script>
import CalendarToolbarDatePicker from "@/components/CalendarToolbarDatePicker";
import CalendarToolbarNavigationButtons from "@/components/CalendarToolbarNavigationButtons";
import CalendarToolbarTypeSelect from "@/components/CalendarToolbarTypeSelect";
import CalendarToolbarWeekLabel from "@/components/CalendarToolbarWeekLabel";

export default {
  name: "CalendarToolbar",
  components: {
    CalendarToolbarNavigationButtons,
    CalendarToolbarDatePicker,
    CalendarToolbarTypeSelect,
    CalendarToolbarWeekLabel
  },
  methods: {
    setToday() {
      this.$store.dispatch("setCalendarDate", new Date());
    }
  }
};
</script>
