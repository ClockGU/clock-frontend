<template>
  <v-container row>
    <v-tooltip v-for="button in buttons" :key="button.icon" bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon @click="changeDate(button.operation, '1')" v-on="on">
          <v-icon>
            {{ button.icon }}
          </v-icon>
        </v-btn>
      </template>
      <span>{{ tooltip(button.operation) }}</span>
    </v-tooltip>
  </v-container>
</template>

<script>
import { dateOperations } from "@/utils/date";
import { mapGetters } from "vuex";

export default {
  name: "CalendarToolbarNavigationButtons",
  data: () => ({
    buttons: [
      { operation: "sub", tooltip: "Tooltip", icon: "keyboard_arrow_left" },
      { operation: "add", tooltip: "Tooltip", icon: "keyboard_arrow_right" }
    ]
  }),
  computed: {
    upperCaseType() {
      return `${this.type.charAt(0).toUpperCase()}${this.type.slice(1)}`;
    },
    ...mapGetters(["type"])
  },
  methods: {
    changeDate(operator, amount) {
      const date = this.$store.state.calendar.date;
      const operation = `${operator}${this.upperCaseType}s`;
      const newDate = dateOperations[operation](date, amount);

      this.$store.dispatch("setCalendarDate", newDate);
    },
    tooltip(operation) {
      const text = operation == "sub" ? "Previous" : "Next";
      return `${text} ${this.upperCaseType}`;
    }
  }
};
</script>
