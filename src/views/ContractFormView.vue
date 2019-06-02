<template>
  <v-container>
    <v-layout row wrap justify-center>
      <v-flex xs12 md8 lg10>
        <contract-form :uuid="uuid" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ContractForm from "@/components/contracts/ContractForm";

export default {
  name: "ContractFormView",
  components: { ContractForm },
  props: {
    uuid: {
      type: String,
      default: null
    }
  }
};
</script>
