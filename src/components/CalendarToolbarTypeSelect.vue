<template>
  <v-flex xs2>
    <v-select v-model="type" :items="types" width="50px"></v-select>
  </v-flex>
</template>

<script>
import { getRouterProps } from "@/utils/date";

export default {
  name: "CalendarToolbarTypeSelect",
  data: () => ({
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
        const props = getRouterProps(type);
        this.$router.push({
          name: "calendar",
          params: props
        });
        this.$store.dispatch("setCalendarType", type);
      }
    }
  }
};
</script>
