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
      :model-value="date"
      no-title
      :allowed-dates="allowed"
      :min="min"
      :max="max"
      :first-day-of-week="1"
      @click:save="menu = false"
      @click:cancel="menu = false"
      @update:model-value="$emit('update:modelValue', $event)"
    ></VDatePicker>
  </v-menu>
</template>

<script>
import { VDatePicker } from 'vuetify/labs/VDatePicker'

import { localizedFormat } from "@/utils/date";
// eslint-disable-next-line no-unused-vars
import { isSunday, parseISO } from "date-fns";

import { mdiCalendar } from "@mdi/js";

export default {
  name: "ShiftFormDateInput",
  components: { VDatePicker },
  props: {
    modelValue: {
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
emits: ['update:modelValue'],
  data() {
    return {
      icons: {
        mdiCalendar
      },
      menu: false,
      date: this.modelValue
    };
  },
  computed: {
    formattedDate() {
      //perhaps not ideal, but most users will be DE
      //TODO check date-fns documentation
      return localizedFormat(this.date, "eee, dd.MM.yyyy");
    }
  },
  watch: {
    modelValue(val) {
      this.date = val;
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    allowed(value) {
      // Commented out for including the UB
      // const parsedValue = parseISO(value);
      // return !isSunday(parsedValue);
      return true;
    }
  }
};
</script>
