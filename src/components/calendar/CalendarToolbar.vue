<template>
  <v-layout align-center>
    <v-btn outlined @click="setToday()">Today</v-btn>
    <CalendarToolbarNavigationButtons />
    <CalendarToolbarDatePicker />
    <CalendarToolbarWeekLabel />
    <v-spacer></v-spacer>
    <CalendarToolbarTypeSelect />
  </v-layout>
</template>

<script>
import { getRouterProps } from "@/utils/date";

import CalendarToolbarDatePicker from "@/components/calendar/CalendarToolbarDatePicker";
import CalendarToolbarNavigationButtons from "@/components/calendar/CalendarToolbarNavigationButtons";
import CalendarToolbarTypeSelect from "@/components/calendar/CalendarToolbarTypeSelect";
import CalendarToolbarWeekLabel from "@/components/calendar/CalendarToolbarWeekLabel";

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
      const date = new Date();
      const props = getRouterProps(this.$store.state.calendar.type, date);
      this.$router.push({
        name: "calendar",
        params: props
      });
      this.$store.dispatch("calendar/setDate", date);
    }
  }
};
</script>
