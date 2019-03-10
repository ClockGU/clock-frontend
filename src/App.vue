<template>
  <v-app id="keep">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      class="grey lighten-4"
      app
    >
      <p>Test</p>
    </v-navigation-drawer>
    <v-toolbar color="amber" app absolute flat clipped-left>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5"
        >Google&nbsp;<span class="font-weight-light">Keep</span></span
      >
      <v-btn outline @click="setToday()">Today</v-btn>
      <v-btn icon @click="changeMonth('-1')">
        <v-icon>
          keyboard_arrow_left
        </v-icon>
      </v-btn>
      <v-btn icon @click="changeMonth('+1')">
        <v-icon>
          keyboard_arrow_right
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <calendar></calendar>
    </v-content>
  </v-app>
</template>

<script>
import { mapFields } from "vuex-map-fields";

import Calendar from "@/components/Calendar";

export default {
  components: { Calendar },
  data: () => ({
    drawer: null
  }),
  computed: {
    ...mapFields({ date: "calendar.date" })
  },
  methods: {
    setToday() {
      this.$store.dispatch("setCalendarDate", new Date());
    },
    changeMonth(operator) {
      const date = this.$store.state.calendar.date;
      const newMonth = eval(`${date.getMonth()} ${operator}`);
      date.setMonth(newMonth);

      this.$store.dispatch("setCalendarDate", new Date(date));
    }
  }
};
</script>
