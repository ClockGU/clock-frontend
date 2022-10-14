<template>
  <v-card class="mx-auto word-break" min-width="400" :max-width="600"></v-card>
</template>

<script>
import { Contract } from "@/models/ContractModel";

export default {
  name: "ContractForm",
  props: {
    existingContract: {
      type: [Contract, typeof undefined],
      required: false,
      default: undefined
    },
    close: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      newContract: undefined
    };
  },
  created() {
    this.initializeNewContract();
  },
  methods: {
    initializeNewContract() {
      this.newContract =
        this.existingContract !== undefined
          ? this.existingContract.clone()
          : new Contract();
    }
  }
};
</script>

<style scoped></style>
