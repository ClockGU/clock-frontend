<template>
  <v-container>
    <ReportListFrame>
      <FrameHooks
        slot-scope="{ reports, methods: { fetchList }, status: { loading } }"
        @created="fetchList()"
      >
        <v-row v-if="!loading">

          <template v-for="report in reports">
            <div :key="report.uuid" :report="report">{{ report }}</div>
          </template>
        </v-row>
      </FrameHooks>
    </ReportListFrame>
  </v-container>
</template>

<script>
import ReportListFrame from "@/components/ReportListFrame";
import FrameHooks from "@/components/FrameHooks";

// import ReportService from "@/services/report.service";

export default {
  name: "ViewReportList",
  components: {
    ReportListFrame,
    FrameHooks
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
