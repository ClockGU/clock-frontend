<template>
  <Calendar
    :initial-focus="focus"
    :initial-type="type"
    @updateRange="updateRange"
    @refresh="refresh"
  >
  </Calendar>
</template>

<script>
import Calendar from "@/components/calendar/Calendar";

import { mdiPlus } from "@mdi/js";

import { mapGetters } from "vuex";

export default {
  name: "ViewCalendar",
  components: {
    Calendar
  },
  props: {
    type: {
      type: String,
      default: "month"
    },
    year: {
      type: String,
      default: String(new Date().getUTCFullYear())
    },
    month: {
      type: String,
      default: String(new Date().getUTCMonth() + 1)
    },
    day: {
      type: String,
      default: String(new Date().getUTCDate())
    }
  },
  data() {
    return {
      icons: { mdiPlus: mdiPlus },
      now: null
    };
  },
  computed: {
    ...mapGetters({
      contracts: "contract/contracts",
      loading: "shift/loading",
      shifts: "shift/shifts"
    }),
    focus() {
      return `${this.year}-${this.month}-${this.day}`;
    },
    date() {
      return new Date(Date.UTC(this.year, this.month - 1, this.day));
    },
    start() {
      return this.date.toISOString().slice(0, 10);
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.$store.dispatch("shift/queryShifts");
      this.$store.dispatch("contract/queryContracts");
    },
    updateRange({ type, start: { day, month, year } }) {
      this.now = type === "day" ? new Date(year, month - 1, day) : new Date();

      // Update router parameters to reflect the calendar range
      this.$router
        .push({
          name: "calendar",
          params: {
            type: type,
            year: year.toString(),
            month: month.toString(),
            day: day.toString()
          }
        })
        .catch(() => {});
    }
  }
};
</script>
