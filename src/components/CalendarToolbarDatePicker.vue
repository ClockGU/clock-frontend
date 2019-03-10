<template>
  <v-menu
    ref="menu"
    v-model="menu"
    offset-y
    full-width
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn flat small v-on="on">
        {{ currentMonth }}
        <v-icon right dark>arrow_drop_down</v-icon>
      </v-btn>
    </template>
    <v-date-picker
      no-title
      scrollable
      v-model="date"
      @input="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CalendarToolbarDatePicker",
  data: () => ({
    menu: false
  }),
  computed: {
    date: {
      get() {
        return this.start;
      },
      set(date) {
        this.$store.dispatch("setCalendarDate", new Date(date));
      }
    },
    currentMonth() {
      const options = { month: "long", year: "numeric" };
      return this.$store.state.calendar.date.toLocaleDateString(
        this.locale,
        options
      );
    },
    ...mapGetters(["locale", "start"])
  }
};
</script>
