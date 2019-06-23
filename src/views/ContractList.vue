<template>
  <v-layout>
    <ul>
      <li v-for="contract in contracts" :key="contract.uuid">
        <v-btn
          :to="{ name: 'editContract', params: { uuid: contract.uuid } }"
          >{{ contract.name }}</v-btn
        >
      </li>
    </ul>
    <v-btn
      absolute
      dark
      fab
      top
      right
      color="pink"
      :to="{ name: 'createContract' }"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ContractList",
  computed: {
    ...mapState({
      contracts: state => state.contract.contracts
    })
  }
};
</script>
