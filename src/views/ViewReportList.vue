<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>
          Reports
        </h1>
      </v-col>
    </v-row>

    <ReportListFrame>
      <FrameHooks
        slot-scope="{ reports, methods: { fetchList }, status: { loading } }"
        @created="fetchList()"
      >
        <v-row>
          <span v-if="loading">Loading...</span>
          <template v-for="report in reports">
            <ReportCard :key="report.uuid" :report="report"></ReportCard>
          </template>
        </v-row>
      </FrameHooks>
    </ReportListFrame>
  </v-container>
</template>

<script>
import ReportListFrame from "@/components/ReportListFrame";
import FrameHooks from "@/components/FrameHooks";
import ReportCard from "@/components/ReportCard";

// import ReportService from "@/services/report.service";

export default {
  name: "ViewReportList",
  components: {
    ReportListFrame,
    FrameHooks,
    ReportCard
  },
  data() {
    return {
      dialog: false,
      callback: null,
      hover: false
    };
  }
};
</script>
