<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    lazy
    transition="scale-transition"
    offset-y
    full-width
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        v-on="on"
        max-width="100px"
        readonly
      ></v-text-field>
    </template>
    <v-date-picker
      no-title
      v-model="date"
      @click:date="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { format } from "date-fns";

export default {
  name: "ShiftFormDateInput",
  data: () => ({
    menu: false,
    date: format(new Date(), "YYYY-MM-DD")
  }),
  props: {
    shift: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  watch: {
    date: function(newDate, oldDate) {
      const [year, month, day] = newDate.split("-");
      const [hours, minutes] = format(oldDate, "HH:mm").split(":");
      this.shift[this.type] = new Date(year, month, day, hours, minutes);
    }
  }
};
</script>
