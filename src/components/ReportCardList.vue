<template>
  <v-row>
    <ReportCard
      v-for="report in visibleReports"
      :key="report.uuid"
      :report="report"
    ></ReportCard>
  </v-row>
</template>

<script>
import ReportCard from "@/components/ReportCard";

export default {
  name: "ReportCardList",
  components: {
    ReportCard
  },
  props: {
    reports: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    visibleReports() {
      if (!this.reports) return null;
      return this.reports.filter(
        report => report.contract == this.$store.state.selectedContract.uuid
      );
    }
  }
};
</script>
