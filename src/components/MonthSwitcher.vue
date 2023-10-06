<template>
  <div>
    <v-btn :disabled="!hasPrevMonth" variant="text" @click="gotoPrevMonth">
      <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
    </v-btn>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template #activator="{ props }">
        <v-btn variant="text" v-bind="props">
          {{ formattedDate }}
        </v-btn>
      </template>
      <VDatePicker
        :value="modelValue"
        :allowed-dates="allowedMonths"
        :min="minMonth"
        :max="maxMonth"
        type="month"
        @click:save="menu = false"
        @click:cancel="menu = false"
        @update:model-value="$emit('update:modelValue', $event)"
      ></VDatePicker>
    </v-menu>

    <v-btn :disabled="!hasNextMonth" variant="text" @click="gotoNextMonth">
      <v-icon>{{ icons.mdiChevronRight }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { addMonths, isAfter, isBefore, subMonths } from "date-fns";
import {
  getFirstOfMonth,
  firstOfCurrentMonth,
  localizedFormat
} from "@/utils/date";
import { mapGetters } from "vuex";
import { VDatePicker } from "vuetify/labs/VDatePicker";

export default {
  name: "MonthSwitcher",
  components: { VDatePicker },
  props: {
    modelValue: {
      type: Date,
      required: true
    },
    allowedDateFn: {
      type: Function,
      required: false,
      default: undefined
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data: () => ({
    menu: false,
    icons: { mdiChevronLeft, mdiChevronRight }
  }),
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract/selectedContract",
      selectedReports: "contentData/selectedReports"
    }),
    formattedDate() {
      return localizedFormat(this.modelValue, "MMMM yyyy");
    },
    hasNextMonth() {
      if (this.disabled) return false;
      const nextMonth = addMonths(this.modelValue, 1);
      return (
        !isAfter(nextMonth, this.selectedContract.endDate) &&
        this.allowedMonths(localizedFormat(nextMonth, "yyyy-MM"))
      );
    },
    hasPrevMonth() {
      if (this.disabled) return false;
      const prevMonth = subMonths(this.modelValue, 1);
      return (
        !isBefore(
          prevMonth,
          getFirstOfMonth(this.selectedContract.startDate)
        ) && this.allowedMonths(localizedFormat(prevMonth, "yyyy-MM"))
      );
    },
    minMonth() {
      if (this.disabled) return localizedFormat(firstOfCurrentMonth, "yyyy-MM");
      return localizedFormat(this.selectedContract.startDate, "yyyy-MM");
    },
    maxMonth() {
      if (this.disabled) return localizedFormat(firstOfCurrentMonth, "yyyy-MM");
      return localizedFormat(this.selectedContract.endDate, "yyyy-MM");
    }
  },
  methods: {
    setDate(value) {
      this.$emit("update:modelValue", value);
    },
    gotoPrevMonth() {
      if (!this.hasPrevMonth) return;
      const date = subMonths(this.modelValue, 1);
      this.setDate(date);
    },
    gotoNextMonth() {
      if (!this.hasNextMonth) return;
      const date = addMonths(this.modelValue, 1);
      this.setDate(date);
    },
    allowedMonths(value) {
      if (this.allowedDateFn !== undefined) return this.allowedDateFn(value);
      return parseInt(value.split("-")[1], 10);
    },
  }
};
</script>
