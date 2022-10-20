<template>
  <div>
    <ContractFormTimeInput
      v-model="minutes"
      :prepend-icon="icons.mdiCalendarClock"
      :label="$t('contracts.carryover.timeLabel')"
      :hint="$t('contracts.carryover.timeSubtitle')"
      allow-negative-values
    />
    <ContractFormDateInput v-model="date" type="start" :min="min" :max="max" />
  </div>
</template>

<script>
import ContractFormTimeInput from "@/components/contracts/ContractFormTimeInput";
import { mdiCalendar } from "@mdi/js";
import { getFirstOfcurrentMonth, getLastOfcurrentMonth } from "@/utils/date";
import ContractFormDateInput from "@/components/contracts/ContractFormDateInput";
import { format } from "date-fns";

export default {
  name: "ContractFormCarryoverInput",
  components: { ContractFormDateInput, ContractFormTimeInput },
  props: {
    carryover: {
      type: Number,
      required: true
    },
    carryoverTargetDate: {
      type: Date,
      required: true
    },
    maxDate: {
      type: Date,
      required: false,
      default: getLastOfcurrentMonth()
    },
    minDate: {
      type: Date,
      required: false,
      default: getFirstOfcurrentMonth()
    }
  },
  data() {
    return {
      minutes: this.carryover,
      date: this.carryoverTargetDate,
      carryoverDateMenu: false,
      icons: { mdiCalendar }
    };
  },
  computed: {
    min() {
      return format(this.minDate, "yyyy-MM-dd");
    },
    max() {
      return format(this.maxDate, "yyyy-MM-dd");
    }
  },
  watch: {
    carryover(val) {
      this.minutes = val;
    },
    carryoverTargetDate(val) {
      this.date = val;
    },
    date(val) {
      this.$emit("input", {
        carryover: this.minutes,
        carryoverTargetDate: val
      });
    },
    minutes(val) {
      this.$emit("input", {
        carryover: val,
        carryoverTargetDate: this.date
      });
    }
  }
};
</script>

<style scoped></style>
