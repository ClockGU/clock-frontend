<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        readonly
        filled
        dense
        hide-details
        :prepend-icon="icons.mdiCalendar"
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
import { Shift } from "@/models/ShiftModel";

import { mdiCalendar } from "@mdi/js";

export default {
  name: "ShiftFormDateInput",
  props: {
    value: {
      type: Object,
      required: true
    },
    min: {
      type: String,
      default: ""
    },
    max: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    icons: {
      mdiCalendar
    },
    menu: false
  }),
  computed: {
    date: {
      get() {
        return format(this.value.date.start, "yyyy-MM-dd");
      },
      set(val) {
        const [year, month, day] = val.split("-");
        const [startHours, startMinutes] = format(
          this.value.date.start,
          "HH:mm"
        ).split(":");
        const [endHours, endMinutes] = format(
          this.value.date.end,
          "HH:mm"
        ).split(":");

        const startDate = new Date(
          year,
          month - 1,
          day,
          startHours,
          startMinutes
        );

        const endDate = new Date(year, month - 1, day, endHours, endMinutes);

        const newValue = { ...this.value };
        newValue.date = { start: startDate, end: endDate };
        const shift = new Shift({ ...newValue });

        this.$emit("input", shift);
      }
    }
  }
};
</script>
