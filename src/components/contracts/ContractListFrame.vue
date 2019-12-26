<template>
  <FrameApi :endpoint="listEndpoint">
    <template
      slot-scope="{ data: contracts, methods: { query: fetchList }, status }"
    >
      <slot :methods="{ fetchList }" :contracts="contracts" :status="status" />
    </template>
  </FrameApi>
</template>

<script>
import FrameApi from "@/components/FrameApi";
import ContractService from "@/services/contract";
import { handleApiError } from "../../utils/interceptors";

export default {
  name: `ContractListFrame`,
  components: {
    FrameApi
  },
  created() {
    this.listEndpoint = () => ContractService.list().catch(handleApiError);
  }
};
</script>
