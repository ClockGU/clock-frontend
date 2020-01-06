<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>
          Reports
        </h1>
      </v-col>
    </v-row>

    <div>
      <span v-if="loading">Loading...</span>
      <ReportCardList v-else :reports="reports" />
    </div>
  </v-container>
</template>

<script>
import ReportCardList from "@/components/ReportCardList";

import { mapGetters } from "vuex";

export default {
  name: "ViewReportList",
  components: {
    ReportCardList
  },
  data() {
    return {
      dialog: false,
      callback: null,
      hover: false
    };
  },
  computed: {
    ...mapGetters({ loading: "report/loading" }),
    reports() {
      return this.$store.state.report.reports;
    }
  },
  mounted() {
    this.$store.dispatch("report/list");
  }
};
</script>
