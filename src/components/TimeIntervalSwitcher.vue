<template>
  <div>
    <v-btn :disabled="!hasPrev" variant="text" @click="gotoPrev">
      <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
    </v-btn>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset="3"
      min-width="290px"
    >
      <template #activator="{ props }">
        <span v-bind="props">
          {{ formattedInterval }}
        </span>
      </template>
      <v-date-picker
        v-model="date"
        :allowed-dates="allowedDates"
        :min="minDate"
        :max="maxDate"
        :type="pickerType"
      ></v-date-picker>
    </v-menu>

    <v-btn :disabled="!hasNext" variant="text" @click="gotoNext">
      <v-icon>{{ icons.mdiChevronRight }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { mapGetters } from "vuex";
import {
  firstOfCurrentMonth,
  getFirstOfMonth,
  getLastOfMonth,
  getMondayOfWeek,
  getSundayOfWeek,
  lastOfCurrentMonth,
  localizedFormat
} from "@/utils/date";
import {
  addDays,
  addMonths,
  addWeeks,
  isAfter,
  isBefore,
  subDays,
  subMonths,
  subWeeks
} from "date-fns";

export default {
  name: "TimeIntervalSwitcher",
  props: {
    modelValue: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      default: "month"
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
    },
    isCalendar: {
      type: Boolean,
      required: false,
      default: false
    }
  },
emits: ['update:modelValue'],
  data() {
    return {
      menu: false,
      icons: { mdiChevronLeft, mdiChevronRight },
      date: this.modelValue
    };
  },
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract/selectedContract",
      selectedReports: "contentData/selectedReports"
    }),
    intervalString() {
      if (this.type === "month") {
        return localizedFormat(this.date, "yyyy-MM");
      }
      return localizedFormat(this.date, "yyyy-MM-dd");
    },
    formattedInterval() {
      if (this.type === "month") {
        return localizedFormat(this.date, "MMMM yyyy");
      }
      if (this.type === "week") {
        return (
          localizedFormat(getMondayOfWeek(this.date), "dd.MM.yyyy") +
          " - " +
          localizedFormat(addDays(getMondayOfWeek(this.date), 6), "dd.MM.yyyy")
        );
      }
      return localizedFormat(this.date, "dd.MM.yyyy");
    },
    hasNext() {
      if (this.disabled) return false;
      if (this.isCalendar) return true;
      if (this.type === "month") {
        const nextMonth = addMonths(this.date, 1);
        return (
          !isAfter(nextMonth, this.selectedContract.endDate) &&
          this.allowedDates(localizedFormat(nextMonth, "yyyy-MM"))
        );
      }
      if (this.type === "week") {
        const nextWeeksMonday = getMondayOfWeek(addWeeks(this.date, 1));
        return (
          !isAfter(nextWeeksMonday, this.selectedContract.endDate) &&
          this.allowedDates(localizedFormat(nextWeeksMonday, "yyyy-MM-dd"))
        );
      }
      if (this.type === "day") {
        const nextDay = addDays(this.date, 1);
        return (
          !isAfter(nextDay, this.selectedContract.endDate) &&
          this.allowedDates(localizedFormat(nextDay, "yyyy-MM-dd"))
        );
      }

      return false;
    },
    hasPrev() {
      if (this.disabled) return false;
      if (this.isCalendar) return true;

      if (this.type === "month") {
        const prevMonth = subMonths(this.date, 1);
        return (
          !isBefore(
            prevMonth,
            getFirstOfMonth(this.selectedContract.startDate)
          ) && this.allowedDates(localizedFormat(prevMonth, "yyyy-MM"))
        );
      }
      if (this.type === "week") {
        const prevWeeksSunday = getSundayOfWeek(subWeeks(this.date, 1));
        return (
          !isBefore(
            prevWeeksSunday,
            getFirstOfMonth(this.selectedContract.startDate)
          ) && this.allowedDates(localizedFormat(prevWeeksSunday, "yyyy-MM-dd"))
        );
      }
      if (this.type === "day") {
        const prevDay = subDays(this.date, 1);
        return (
          !isBefore(
            prevDay,
            getFirstOfMonth(this.selectedContract.startDate)
          ) && this.allowedDates(localizedFormat(prevDay, "yyyy-MM-dd"))
        );
      }

      return false;
    },
    minDate() {
      if (this.isCalendar) return undefined;
      if (this.disabled)
        return localizedFormat(firstOfCurrentMonth, "yyyy-MM-dd");
      return localizedFormat(this.selectedContract.startDate, "yyyy-MM-dd");
    },
    maxDate() {
      if (this.isCalendar) return undefined;
      if (this.disabled)
        return localizedFormat(lastOfCurrentMonth, "yyyy-MM-dd");
      return localizedFormat(this.selectedContract.endDate, "yyyy-MM-dd");
    },
    pickerType() {
      if (this.type === "month") return "month";
      return "date";
    }
  },
  watch: {
    modelValue(val) {
      this.date = val;
    },
    date(val) {
      this.$emit("update:modelValue", val);
    }
  },
  methods: {
    setDate(date) {
      this.$emit("update:modelValue", date);
    },
    gotoPrev() {
      if (!this.hasPrev) return;

      if (this.type === "month") {
        const newDate = getFirstOfMonth(subMonths(this.date, 1));
        this.setDate(newDate);
      } else if (this.type === "week") {
        const newDate = subWeeks(this.date, 1);
        if (this.date.getMonth() !== newDate.getMonth())
          this.setDate(getFirstOfMonth(newDate));
        this.setDate(newDate);
      } else if (this.type === "day") {
        const newDate = subDays(this.date, 1);
        this.setDate(newDate);
      }
    },
    gotoNext() {
      if (!this.hasNext) return;

      if (this.type === "month") {
        const newDate = getFirstOfMonth(addMonths(this.date, 1));
        this.setDate(newDate);
      } else if (this.type === "week") {
        const newDate = addWeeks(this.date, 1);
        if (this.date.getMonth() !== newDate.getMonth())
          this.setDate(getLastOfMonth(newDate));
        this.setDate(newDate);
      } else if (this.type === "day") {
        const newDate = addDays(this.date, 1);
        this.setDate(newDate);
      }
    },
    allowedDates(value) {
      if (this.allowedDateFn !== undefined) return this.allowedDateFn(value);
      return value;
    },
    inputDate(value) {
      console.log(value);
      this.setDate(new Date(value));
    }
  }
};
</script>

<style scoped></style>
