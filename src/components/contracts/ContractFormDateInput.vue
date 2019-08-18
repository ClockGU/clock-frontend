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
        :label="label"
        readonly
        prepend-inner-icon="calendar_today"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      :min="min"
      :max="max"
      @click:date="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { format } from "date-fns";

export default {
  name: "ContractFormDateInput",
  props: {
    value: {
      type: Date,
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

      return format(this.contract.date.start, "YYYY-MM-DD");
    },
    max() {
      if (this.type === "end") return undefined;

      return format(this.contract.date.end, "YYYY-MM-DD");
    }
  }
};
</script>
