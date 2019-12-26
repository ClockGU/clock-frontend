<template>
  <FrameApi :endpoint="listEndpoint">
    <template
      slot-scope="{ data: shifts, methods: { query: fetchList }, status }"
    >
      <slot :methods="{ fetchList }" :shifts="shifts" :status="status" />
    </template>
  </FrameApi>
</template>

<script>
import FrameApi from "@/components/FrameApi";
import ShiftService from "@/services/shift";
import { handleApiError } from "../../utils/interceptors";

export default {
  name: `ShiftListFrame`,
  components: {
    FrameApi
  },
  created() {
    this.listEndpoint = () => ShiftService.list().catch(handleApiError);
  }
};
</script>
