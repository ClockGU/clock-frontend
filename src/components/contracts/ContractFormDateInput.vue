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
import { parseISO, isLastDayOfMonth, format } from "date-fns";
import { localizedFormat } from "@/utils/date";
import { mdiCalendarArrowLeft, mdiCalendarArrowRight } from "@mdi/js";

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
  data() {
    return {
      icons: {
        mdiCalendarArrowLeft,
        mdiCalendarArrowRight
      },
      menu: false,
      date: format(this.value, "yyyy-MM-dd")
    };
  },
  computed: {
    icon() {
      if (this.type === "start") return this.icons.mdiCalendarArrowRight;

      return this.icons.mdiCalendarArrowLeft;
    },
    formattedDate() {
      return localizedFormat(this.value, "eee do MMM yyyy");
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
<style scoped></style>
