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
        :value="formattedDate"
        readonly
        filled
        dense
        hide-details
        :prepend-icon="icon"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      :allowed-dates="type === 'start' ? allowedStartDates : allowedEndDates"
      :first-day-of-week="1"
      :max="max"
      :min="min"
      no-title
      @click:date="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { format, parseISO, isLastDayOfMonth } from "date-fns";

import { mdiCalendarArrowLeft, mdiCalendarArrowRight } from "@mdi/js";

export default {
  name: "ContractFormDateInput",
  props: {
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: null
    },
    contract: {
      type: Object,
      required: true
    },
    max: {
      type: String,
      default: null
    },
    min: {
      type: String,
      default: null
    },
    type: {
      type: String,
      required: true
    }
  },
  data: () => ({
    icons: {
      mdiCalendarArrowLeft,
      mdiCalendarArrowRight
    },
    menu: false
  }),
  computed: {
    icon() {
      if (this.type === "start") return this.icons.mdiCalendarArrowRight;

      return this.icons.mdiCalendarArrowLeft;
    },
    formattedDate() {
      return format(parseISO(this.value), "eee do MMM yyyy");
    },
    date: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    allowedStartDates(val) {
      const day = parseInt(val.split("-")[2], 10);
      return day === 1 || day === 16;
    },
    allowedEndDates(val) {
      const day = parseInt(val.split("-")[2], 10);
      return day === 15 || isLastDayOfMonth(parseISO(val));
    }
  }
};
</script>
