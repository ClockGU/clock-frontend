<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    full-width
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        readonly
        prepend-inner-icon="calendar_today"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      no-title
      :min="min"
      :max="max"
      @click:date="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { format } from "date-fns";

export default {
  name: "ShiftFormDateInput",
  props: {
    value: {
      type: Date,
      required: true
    },
    shift: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data: () => ({
    menu: false
  }),
  computed: {
    date: {
      get() {
        return format(this.value, "YYYY-MM-DD");
      },
      set(val) {
        const [year, month, day] = val.split("-");
        const [hours, minutes] = format(this.value, "HH:mm").split(":");
        this.$emit("input", new Date(year, month - 1, day, hours, minutes));
      }
    },
    min() {
      if (this.type === "start") return undefined;

      return format(this.shift.date.start, "YYYY-MM-DD");
    },
    max() {
      if (this.type === "end") return undefined;

      return format(this.shift.date.end, "YYYY-MM-DD");
    }
  }
};
</script>
