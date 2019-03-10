<template>
  <v-layout align-center row>
    <v-btn outline @click="setToday()">Today</v-btn>
    <calendar-toolbar-navigation-buttons />
    <calendar-toolbar-date-picker />
    <v-flex xs5>
      <calendar-toolbar-type-select />
    </v-flex>
  </v-layout>
</template>

<script>
import CalendarToolbarDatePicker from "@/components/CalendarToolbarDatePicker";
import CalendarToolbarNavigationButtons from "@/components/CalendarToolbarNavigationButtons";
import CalendarToolbarTypeSelect from "@/components/CalendarToolbarTypeSelect";

export default {
  name: "CalendarToolbar",
  components: {
    CalendarToolbarNavigationButtons,
    CalendarToolbarDatePicker,
    CalendarToolbarTypeSelect
  },
  methods: {
    setToday() {
      this.$store.dispatch("setCalendarDate", new Date());
    }
  }
};
</script>
