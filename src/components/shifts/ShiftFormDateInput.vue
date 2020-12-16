<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="formattedDate"
        readonly
        filled
        dense
        hide-details
        :prepend-icon="icons.mdiCalendar"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      no-title
      :min="min"
      :max="max"
      :first-day-of-week="1"
      @click:date="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { localizedFormat } from "@/utils/date";
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
    formattedDate() {
      return localizedFormat(this.value.date.start, "eee dd',' yyyy");
    },
    date: {
      get() {
        return localizedFormat(this.value.date.start, "yyyy-MM-dd");
      },
      set(val) {
        const [year, month, day] = val.split("-");
        const [startHours, startMinutes] = localizedFormat(
          this.value.date.start,
          "HH:mm"
        ).split(":");
        const [endHours, endMinutes] = localizedFormat(
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
