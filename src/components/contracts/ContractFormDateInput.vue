<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="290px"
    :nudge-right="40"
    :nudge-bottom="56"
  >
    <template #activator="{ props }">
      <v-text-field
        :model-value="formattedDate"
        readonly
        variant="filled"
        :prepend-icon="icon"
        :disabled="disabled"
        :error="error"
        v-bind="props"
        @click="shouldClose = false"
        @mousedown="shouldClose = false"
      ></v-text-field>
    </template>
    <v-date-picker
      v-if="!shouldClose"
      v-model="date"
      :allowed-dates="type === 'start' ? allowedStartDates : allowedEndDates"
      :first-day-of-week="1"
      :max="max"
      :min="min"
      no-title
      @click:save="menu = false"
      @click:cancel="menu = false"
      @update:model-value="$emit('update:modelValue', $event)"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { isLastDayOfMonth, getDate } from "date-fns";
import { localizedFormat } from "@/utils/date";
import { mdiCalendarArrowLeft, mdiCalendarArrowRight } from "@mdi/js";

export default {
  name: "ContractFormDateInput",
  props: {
    modelValue: {
      type: Date,
      required: true
    },
    label: {
      type: String,
      default: null
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
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      icons: {
        mdiCalendarArrowLeft,
        mdiCalendarArrowRight
      },
      menu: false,
      date: this.modelValue,
      shouldClose: false
    };
  },
  computed: {
    icon() {
      if (this.type === "start") return this.icons.mdiCalendarArrowRight;

      return this.icons.mdiCalendarArrowLeft;
    },
    formattedDate() {
      return localizedFormat(this.modelValue, "eee do MMM yyyy");
    }
  },
  watch: {
    modelValue(val) {
      this.date = val;
      this.shouldClose = true;
    }
  },
  methods: {
    allowedStartDates(val) {
      const day = getDate(val);
      return day === 1 || day === 16;
    },
    allowedEndDates(val) {
      const day = getDate(val);
      return day === 15 || isLastDayOfMonth(val);
    }
  }
};
</script>
