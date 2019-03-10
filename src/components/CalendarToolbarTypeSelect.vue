<template>
  <v-select v-model="type" :items="types"></v-select>
</template>

<script>
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
        this.$store.dispatch("setCalendarType", type);
      }
    }
  }
};
</script>
