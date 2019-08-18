<template>
  <v-menu
    ref="menu"
    v-model="menu"
    offset-y
    full-width
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn text small v-on="on">
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
import { mapState } from "vuex";

import { getRouterProps } from "@/utils/date";

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
      set(payload) {
        const date = new Date(payload);
        const props = getRouterProps(this.type, date);
        this.$router.push({
          name: "calendar",
          params: props
        });

        this.$store.dispatch("calendar/setDate", date);
      }
    },
    currentMonth() {
      const options = { month: "long", year: "numeric" };
      return this.$store.state.calendar.date.toLocaleDateString(
        this.locale,
        options
      );
    },
    ...mapState("calendar", {
      locale: state => state.locale,
      start: state => state.start,
      type: state => state.type
    })
  }
};
</script>
