<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="formattedDate"
        readonly
        variant="filled"
        density="compact"
        hide-details
        :prepend-icon="icons.mdiCalendar"
        v-bind="props"
      ></v-text-field>
    </template>
    <VDatePicker
      v-model="date"
      no-title
      :allowed-dates="allowed"
      :min="min"
      :max="max"
      :first-day-of-week="1"
      @click:date="menu = false"
    ></VDatePicker>
  </v-menu>
</template>

<script>
import { VDatePicker } from 'vuetify/labs/VDatePicker'

import { localizedFormat } from "@/utils/date";
import { isSunday, parseISO } from "date-fns";

import { mdiCalendar } from "@mdi/js";

export default {
  name: "ShiftFormDateInput",
  components: { VDatePicker },
  props: {
    value: {
      type: Date,
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
  data() {
    return {
      icons: {
        mdiCalendar
      },
      menu: false,
      date: localizedFormat(this.value, "yyyy-MM-dd")
    };
  },
  computed: {
    formattedDate() {
      //perhaps not ideal, but most users will be DE
      //TODO check date-fns documentation
      return localizedFormat(parseISO(this.date), "eee, dd.MM.yyyy");
    }
  },
  watch: {
    value(val) {
      this.date = localizedFormat(val, "yyyy-MM-dd");
    },
    date(val) {
      const [year, month, day] = val.split("-");
      this.$emit("input", new Date(year, month - 1, day));
    }
  },
  methods: {
    allowed(value) {
      const parsedValue = parseISO(value);
      return !isSunday(parsedValue);
    }
  }
};
</script>
