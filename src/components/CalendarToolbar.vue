<template>
  <div>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapFields } from "vuex-map-fields";

export default {
  name: "CalendarToolbar",
  data: () => ({
    drawer: null,
    menu: false
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
