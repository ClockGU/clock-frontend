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
        <div>
          <span v-if="loading">Loading...</span>
          <ReportCardList :reports="reports" />
        </div>
      </FrameHooks>
    </ReportListFrame>
  </v-container>
</template>

<script>
import ReportListFrame from "@/components/ReportListFrame";
import FrameHooks from "@/components/FrameHooks";
import ReportCardList from "@/components/ReportCardList";

// import ReportService from "@/services/report";

export default {
  name: "ViewReportList",
  components: {
    ReportListFrame,
    FrameHooks,
    ReportCardList
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
