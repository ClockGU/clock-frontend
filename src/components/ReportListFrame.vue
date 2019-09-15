<template>
  <FrameApi :endpoint="listEndpoint">
    <template
      slot-scope="{ data: reports, methods: { query: fetchList }, status }"
    >
      <slot :methods="{ fetchList }" :reports="reports" :status="status" />
    </template>
  </FrameApi>
</template>

<script>
import FrameApi from "@/components/FrameApi";
import ReportService from "@/services/report.service";

export default {
  name: `ContractListFrame`,
  components: {
    FrameApi
  },
  created() {
    this.listEndpoint = () => ReportService.list();
  }
};
</script>
