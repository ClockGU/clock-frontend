<template>
  <v-card-text></v-card-text>
</template>

<script>
import { Contract } from "@/models/ContractModel";

export default {
  name: "ContractFormFields",
  props: {
    value: {
      type: Contract,
      required: true
    }
  },
  data() {
    return {
      contract: this.value
    };
  },
  watch: {
    value(value) {
      this.contract = value;
    },
    contract(value) {
      this.$emit("input", value);
    }
  }
};
</script>

<style scoped></style>
