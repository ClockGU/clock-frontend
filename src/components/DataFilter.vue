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
  min,
  max,
  addMonths,
  format,
  isBefore,
  isAfter,
  subMonths,
  isSameMonth
} from "date-fns";

import { log } from "@/utils/log";

import { mapGetters } from "vuex";

export default {
  name: "DataFilter",
  props: {
    contract: {
      type: Object,
      required: true
    },
    date: {
      type: String,
      default: () => format(new Date(), "yyyy-MM")
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
    isCurrentMonthLocked() {
      return this.lockedMonths
        .filter(month => Object.values(month)[0] === true)
        .map(month => Object.keys(month)[0])
        .includes(this.date);
    },
    firstUnlockedMonth() {
      const allLocked = this.lockedMonths
        .map(month => Object.entries(month)[0][1])
        .every(item => item === true);

      if (allLocked) {
        console.log(Object.entries(this.lockedMonths)[0]);
        return this.lockedMonths.map(month => Object.keys(month)[0])[
          this.lockedMonths.length - 1
        ];
      }

      return Object.entries(
        this.lockedMonths.find(month => {
          const entries = Object.entries(month)[0];
          return entries[1] === false;
        })
      )[0][0];
    },
    lockedMonths() {
      return this.reports.map(report => {
        const reportDate = new Date(report.date);
        const stringDate = format(reportDate, "yyyy-MM");

        const shifts = this.shifts.filter(shift =>
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
            .map(shift => shift.locked)
            .every(val => val === true)
        };
      });
    },
    reports() {
      return this.reportsVuex.filter(
        report => report.contract === this.contract.uuid
      );
    },
    shifts() {
      return this.shiftsVuex.filter(
        shift => shift.contract === this.contract.uuid
      );
    },
    dates() {
      return this.reports.map(report => new Date(report.date));
    },
    months() {
      const months = this.reports.map(report => report.date.slice(0, 7));

      return {
        months,
        min: format(min(this.dates), "yyyy-MM-dd"),
        max: format(max(this.dates), "yyyy-MM-dd"),
        allowedMonths: value => {
          return months.includes(value);
        }
      };
    },
    data() {
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
        shifts: this.shifts.filter(
          shift => shift.date.start.slice(0, 7) === this.date
        ),
        report: this.reports.find(
          report => report.date.slice(0, 7) === this.date
        )
      };
    },
    hasNextMonth() {
      return isAfter(new Date(this.data.months.max), new Date(this.data.date));
    },
    hasPrevMonth() {
      return isBefore(new Date(this.data.months.min), new Date(this.data.date));
    }
  },
  watch: {
    firstUnlockedMonth: function(newValue, oldValue) {
      if (newValue === oldValue) return;

      this.setDate(newValue);
    }
  },
  async created() {
    this.setDate(this.firstUnlockedMonth);
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
      this.setDate(format(nextMonth, "yyyy-MM"));
    },
    prevMonth() {
      const prevMonth = subMonths(new Date(this.data.date), 1);
      this.setDate(format(prevMonth, "yyyy-MM"));
    }
  }
};
</script>
