<template>
  <v-layout wrap justify-center>
    <v-flex xs12 md8 lg10>
      <ContractForm :uuid="uuid" :entity="entity" />
    </v-flex>
  </v-layout>
</template>

<script>
import ContractForm from "@/components/contracts/ContractForm";
import { Contract } from "@/models/ContractModel";

export default {
  name: "ViewContractForm",
  components: { ContractForm },
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  created() {
    const contracts = this.$store.state.contract.contracts;

    this.entity = new Contract(
      contracts.find(contract => contract.uuid === this.uuid)
    );
  }
};
</script>
