<template>
  <v-layout row>
    <v-btn outline @click="setToday()">Today</v-btn>
    <calendar-toolbar-navigation-buttons />
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
        v-model="datePicker"
        @input="menu = false"
      ></v-date-picker>
    </v-menu>
    <v-select v-model="type" :items="types" height="20px"> </v-select>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { mapFields } from "vuex-map-fields";

import CalendarToolbarNavigationButtons from "@/components/CalendarToolbarNavigationButtons";

export default {
  name: "CalendarToolbar",
  components: { CalendarToolbarNavigationButtons },
  data: () => ({
    drawer: null,
    menu: false,
    types: [
      { text: "Day", value: "day" },
      { text: "Week", value: "week" },
      { text: "Month", value: "month" }
    ]
  }),
  computed: {
    datePicker: {
      get() {
        return this.start;
      },
      set(date) {
        this.$store.dispatch("setCalendarDate", new Date(date));
      }
    },
    type: {
      get() {
        return this.types.filter(
          type => type.value == this.$store.state.calendar.type
        )[0];
      },
      set(type) {
        this.$store.dispatch("setCalendarType", type);
      }
    },
    currentMonth() {
      const options = { month: "long", year: "numeric" };
      return this.$store.state.calendar.date.toLocaleDateString(
        this.locale,
        options
      );
    },
    ...mapGetters(["locale", "start"]),
    ...mapFields({ date: "calendar.date" })
  },
  methods: {
    setToday() {
      this.$store.dispatch("setCalendarDate", new Date());
    }
  }
};
</script>
