<template>
  <div>
    <v-btn :disabled="!hasPrev" text @click="gotoPrev">
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
      <template #activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">
          {{ formattedInterval }}
        </span>
      </template>
      <v-date-picker
        :value="intervalString"
        :allowed-dates="allowedDates"
        :min="minDate"
        :max="maxDate"
        type="getInterval"
        @input="inputDate"
      ></v-date-picker>
    </v-menu>

    <v-btn :disabled="!hasNext" text @click="gotoNext">
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
  getFirstOfWeek,
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
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      required: true,
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
    }
  },
  data: () => ({
    menu: false,
    icons: { mdiChevronLeft, mdiChevronRight }
  }),
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
      } else if (this.type === "week") {
        return (
          localizedFormat(getFirstOfWeek(this.date), "dd.MM.yyyy") +
          " - " +
          localizedFormat(addDays(getFirstOfWeek(this.date), 6), "dd.MM.yyyy")
        );
      } else {
        return localizedFormat(this.date, "dd.MM.yyyy");
      }
    },
    hasNext() {
      if (this.disabled) return false;

      if (this.type === "month") {
        const nextMonth = addMonths(this.date, 1);
        return (
          !isAfter(nextMonth, this.selectedContract.endDate) &&
          this.allowedDates(localizedFormat(nextMonth, "yyyy-MM-dd"))
        );
      }
      if (this.type === "week") {
        const nextWeek = addWeeks(this.date, 1);
        return (
          !isAfter(nextWeek, this.selectedContract.endDate) &&
          this.allowedDates(localizedFormat(nextWeek, "yyyy-MM-dd"))
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

      if (this.type === "month") {
        const prevMonth = subMonths(this.date, 1);
        return (
          !isBefore(
            prevMonth,
            getFirstOfMonth(this.selectedContract.startDate)
          ) && this.allowedDates(localizedFormat(prevMonth, "yyyy-MM-dd"))
        );
      }
      if (this.type === "week") {
        const prevWeek = subWeeks(this.date, 1);
        return (
          !isBefore(
            prevWeek,
            getFirstOfMonth(this.selectedContract.startDate)
          ) && this.allowedDates(localizedFormat(prevWeek, "yyyy-MM-dd"))
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
      if (this.disabled)
        return localizedFormat(firstOfCurrentMonth, "yyyy-MM-dd");
      return localizedFormat(this.selectedContract.startDate, "yyyy-MM-dd");
    },
    maxDate() {
      if (this.disabled)
        return localizedFormat(lastOfCurrentMonth, "yyyy-MM-dd");
      return localizedFormat(this.selectedContract.endDate, "yyyy-MM-dd");
    }
  },
  methods: {
    setDate(value) {
      this.$emit("update", value);
    },
    getInterval() {
      return this.type;
    },
    gotoPrev() {
      if (!this.hasPrev) return;

      if (this.type === "month") {
        const date = subMonths(this.date, 1);
        this.setDate(date);
      } else if (this.type === "week") {
        const date = subWeeks(this.date, 1);
        this.setDate(date);
      } else if (this.type === "day") {
        const date = subDays(this.date, 1);
        this.setDate(date);
      }
    },
    gotoNext() {
      if (!this.hasNext) return;

      if (this.type === "month") {
        const date = addMonths(this.date, 1);
        this.setDate(date);
      } else if (this.type === "week") {
        const date = addWeeks(this.date, 1);
        this.setDate(date);
      } else if (this.type === "day") {
        const date = addDays(this.date, 1);
        this.setDate(date);
      }
    },
    allowedDates(value) {
      if (this.allowedDateFn !== undefined) return this.allowedDateFn(value);
      return parseInt(value.split("-")[1], 10);
    },
    inputDate(value) {
      this.setDate(new Date(value));
    }
  }
};
</script>

<style scoped></style>