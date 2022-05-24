<template>
  <div>
    <slot v-if="loading" name="loading">
      <div>Loading...</div>
    </slot>
    <slot v-else-if="error">
      <div>Something went wrong...</div>
    </slot>
    <slot v-else v-bind="{ data }"></slot>
  </div>
</template>

<script>
import {
  addMonths,
  isAfter,
  isBefore,
  isFuture,
  isPast,
  isSameMonth,
  min,
  max,
  parseISO,
  subMonths
} from "date-fns";
import is from "ramda/src/is";

import { localizedFormat } from "@/utils/date";
import { log } from "@/utils/log";

import { mapGetters } from "vuex";

export default {
  name: "DataFilter",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    contract: {
      type: Object,
      required: true
    },
    date: {
      type: String,
      default: () => localizedFormat(new Date(), "yyyy-MM")
    },
    // Allow the consumer to pass a function that post processes the shifts
    shiftFn: {
      type: Function,
      default: (shift) => shift
    },
    // Set the date to the first unlocked month. Only required by the Reports
    // view
    useUlockedMonths: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    error: false,
    loading: true
  }),
  computed: {
    ...mapGetters({
      clockedShift: "clock/clockedShift",
      contractsVuex: "contract/contracts",
      shiftsVuex: "shift/shifts",
      reportsVuex: "report/reports"
    }),
    lastMonth() {
      // Retrieve the last available month
      return this.lockedMonths.map((month) => Object.keys(month)[0])[
        this.lockedMonths.length - 1
      ];
    },
    isCurrentMonthLocked() {
      return this.lockedMonths
        .filter((month) => Object.values(month)[0] === true)
        .map((month) => Object.keys(month)[0])
        .includes(this.date);
    },
    firstUnlockedMonth() {
      const allLocked = this.lockedMonths
        .map((month) => Object.entries(month)[0][1])
        .every((item) => item === true);

      // If all months are locked, we look at the latest available month
      if (allLocked) {
        return this.lastMonth;
      }

      return Object.entries(
        this.lockedMonths.find((month) => {
          const entries = Object.entries(month)[0];
          return entries[1] === false;
        })
      )[0][0];
    },
    lockedMonths() {
      return this.reports.map((report) => {
        const reportDate = new Date(report.date);
        const stringDate = localizedFormat(reportDate, "yyyy-MM");

        const shifts = this.shifts.filter((shift) =>
          isSameMonth(new Date(shift.date.start), reportDate)
        );
        // We need to return `false` if there are not saved shifts. The
        // `.every()` call below returns `true` for an empty list otherwise.
        if (shifts.length < 1)
          return {
            [stringDate]: false
          };

        // Check if all `locked` properties are true
        return {
          [stringDate]: shifts
            .map((shift) => shift.locked)
            .every((val) => val === true)
        };
      });
    },
    reports() {
      return this.reportsVuex.filter(
        (report) => report.contract === this.contract.uuid
      );
    },
    shifts() {
      return this.shiftsVuex
        .filter((shift) => shift.contract === this.contract.uuid)
        .sort((a, b) => {
          return new Date(b.date.end) - new Date(a.date.end);
        });
    },
    futureShifts() {
      return this.processShifts.filter((shift) => {
        // If we do not process the shifts we need to access `shift.date`.
        // Otherwise we need to access `shift.shift.date`.
        let date =
          shift.shift === undefined ? shift.date.start : shift.shift.date.start;

        if (is(String, date)) {
          date = parseISO(date);
        }

        return isFuture(date);
      });
    },
    pastShifts() {
      return this.processShifts.filter((shift) => {
        // If we do not process the shifts we need to access `shift.date`.
        // Otherwise we need to access `shift.shift.date`.
        let date =
          shift.shift === undefined ? shift.date.start : shift.shift.date.start;

        if (is(String, date)) {
          date = parseISO(date);
        }

        return isPast(date);
      });
    },
    reviewedShifts() {
      return this.processShifts.filter((shift) => shift.reviewed === true);
    },
    unreviewedShifts() {
      return this.processShifts.filter((shift) => shift.reviewed === false);
    },
    dates() {
      if (this.disabled) {
        return [new Date()];
      }
      return this.reports.map((report) => new Date(report.date));
    },
    months() {
      const months = this.reports.map((report) => report.date.slice(0, 7));
      if (this.$route.path.includes("shifts")) {
        return {
          months,
          min: localizedFormat(parseISO(this.contract.date.start), "yyyy-MM"),
          max: localizedFormat(parseISO(this.contract.date.end), "yyyy-MM"),
          allowedMonths: (value) => parseInt(value.split("-")[1], 10)
        };
      } else {
        return {
          months,
          min: localizedFormat(min(this.dates), "yyyy-MM-dd"),
          max: localizedFormat(max(this.dates), "yyyy-MM-dd"),
          allowedMonths: (value) => {
            return months.includes(value);
          }
        };
      }
    },
    processShifts() {
      // Postprocess the shifts before returning them in the scoped slot
      const filteredShifts = this.shifts.filter(
        (shift) => shift.date.start.slice(0, 7) === this.date
      );
      return filteredShifts.map(this.shiftFn);
    },
    data() {
      if (this.disabled) {
        return {
          shifts: [],
          month: "",
          report: {
            uuid: "",
            date: new Date(),
            carryover: { prev: "HH:MM", next: "HH:MM" },
            debit_worktime: "HH:MM",
            net_worktime: "HH:MM"
          },
          isCurrentMonthLocked: false,
          firstUnlockedMonth: new Date(),
          date: this.date,
          hasNextMonth: () => this.hasNextMonth,
          hasPrevMonth: () => this.hasPrevMonth,
          nextMonth: this.nextMonth,
          prevMonth: this.prevMonth,
          months: [new Date()]
        };
      }
      return {
        date: this.date,
        hasNextMonth: () => this.hasNextMonth,
        hasPrevMonth: () => this.hasPrevMonth,
        isCurrentMonthLocked: this.isCurrentMonthLocked,
        firstUnlockedMonth: this.firstUnlockedMonth,
        nextMonth: this.nextMonth,
        prevMonth: this.prevMonth,
        months: this.months,
        contracts: this.contracts,
        shifts: this.processShifts,
        futureShifts: this.futureShifts,
        pastShifts: this.pastShifts,
        report: this.reports.find(
          (report) => report.date.slice(0, 7) === this.date
        )
      };
    },
    hasNextMonth() {
      return isAfter(new Date(this.data.months.max), new Date(this.data.date));
    },
    hasPrevMonth() {
      return isBefore(new Date(this.data.months.min), new Date(this.data.date));
    },
    previousMonth() {
      if (!this.hasPrevMonth) return 0;

      const monthIndex = this.months.months.indexOf(this.date);
      return this.months.months[monthIndex - 1];
    }
  },
  watch: {
    contract: function (newValue, oldValue) {
      if (newValue === oldValue) return;

      const date = this.useUlockedMonths
        ? this.firstUnlockedMonth
        : this.lastMonth;
      this.setDate(date);
    }
  },
  async created() {
    if (this.useUlockedMonths) {
      this.setDate(this.firstUnlockedMonth);
    }
    try {
      await Promise.all([
        this.$store.dispatch("shift/queryShifts"),
        this.$store.dispatch("contract/queryContracts"),
        this.$store.dispatch("report/list")
      ]);
    } catch (error) {
      log(error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    setDate(value) {
      this.$emit("update", value);
    },
    nextMonth() {
      const nextMonth = addMonths(new Date(this.data.date), 1);
      this.setDate(localizedFormat(nextMonth, "yyyy-MM"));
    },
    prevMonth() {
      const prevMonth = subMonths(new Date(this.data.date), 1);
      this.setDate(localizedFormat(prevMonth, "yyyy-MM"));
    }
  }
};
</script>
