<template>
  <v-flex xs2>
    <v-select v-model="type" :items="types" width="50px"></v-select>
  </v-flex>
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
        const date = new Date();
        const [year, month, day] = [
          String(date.getUTCFullYear()),
          String(date.getUTCMonth() + 1),
          String(date.getUTCDate())
        ];

        const props = {
          type: type,
          year: year,
          month: month,
          day: day
        };
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
