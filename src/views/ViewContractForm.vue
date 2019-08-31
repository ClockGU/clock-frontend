<template>
  <v-layout wrap justify-center>
    <v-flex xs12 md8 lg10>
      <ContractForm v-if="entity" :uuid="uuid" :entity="entity" />
    </v-flex>
  </v-layout>
</template>

<script>
import ContractForm from "@/components/contracts/ContractForm";
import { Contract } from "@/models/ContractModel";
import ContractService from "@/services/contract.service";

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
      entity: null
    };
  },
  async created() {
    const contracts = this.$store.state.contract.contracts;
    const entity = contracts.find(contract => contract.uuid === this.uuid);

    if (entity !== undefined) {
      this.entity = new Contract(entity);
    } else {
      const response = await ContractService.get(this.uuid);
      this.entity = new Contract(response.data);
    }
  }
};
</script>
