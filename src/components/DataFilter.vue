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
import { min, max, format } from "date-fns";
import { log } from "@/utils/log";
export default {
  name: "DataFilter",
  data: () => ({
    error: false,
    loading: true,
    data: null
  }),
  async created() {
    try {
      const [shifts, contracts, reports] = await Promise.all([
        this.$store.dispatch("shift/queryShifts"),
        this.$store.dispatch("contract/queryContracts"),
        this.$store.dispatch("report/list")
      ]);

      const months = reports.map(report => report.date.slice(0, 7));
      const dates = reports.map(report => new Date(report.date));

      this.data = {
        shifts,
        contracts,
        reports,
        months: {
          months,
          min: format(min(dates), "yyyy-MM-dd"),
          max: format(max(dates), "yyyy-MM-dds")
        },
        allowedMonths: value => {
          return months.includes(value);
        }
      };
    } catch (error) {
      log(error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
};
</script>
