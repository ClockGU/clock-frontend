<template>
  <ul>
    <li v-for="contract in contracts" :key="contract.uuid">
      <v-btn :to="{ name: 'editContract', params: { uuid: contract.uuid } }">
        {{ contract.name }}
      </v-btn>
    </li>
  </ul>
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
