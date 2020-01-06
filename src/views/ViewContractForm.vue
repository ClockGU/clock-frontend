<template>
  <v-layout wrap justify-center>
    <v-flex xs12 lg10>
      <ContractForm
        v-if="entity"
        :query="endpoint"
        :uuid="uuid"
        :entity="entity"
        @submit="redirect"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import ContractForm from "@/components/contracts/ContractForm";
import { Contract } from "@/models/ContractModel";
import ContractService from "@/services/contract";
import { handleApiError } from "../utils/interceptors";

export default {
  name: "ViewContractForm",
  components: { ContractForm },
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      entity: null,
      endpoint: null
    };
  },
  async created() {
    const contracts = this.$store.state.contract.contracts;

    const entity = contracts.find(contract => contract.uuid === this.uuid);
    this.endpoint = data =>
      this.uuid === null
        ? ContractService.create(data.toPayload())
        : ContractService.update(data.toPayload(), this.uuid);

    if (entity !== undefined) {
      this.entity = new Contract(entity);
    } else if (this.uuid != null) {
      const response = await ContractService.get(this.uuid).catch(
        handleApiError
      );
      this.entity = new Contract(response.data);
    } else {
      this.entity = new Contract();
    }
  },
  methods: {
    redirect() {
      let routerParam = { name: "contractList" };

      // We need to go back to the selection screen
      if (this.$store.state.selectedContract === null) {
        routerParam = { name: "contractSelect" };
      }

      this.$router.push(routerParam);
    }
  }
};
</script>
