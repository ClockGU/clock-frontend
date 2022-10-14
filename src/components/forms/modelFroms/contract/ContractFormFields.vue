<template>
  <v-card-text>
    <ContractDurationInput
      :start-date="contract.startDate"
      :end-date="contract.endDate"
      @input="setDates"
    ></ContractDurationInput>
    <span> {{ contract.startDate }} - {{ contract.endDate }}</span>
    <v-row align="center" justify="start"> </v-row>
  </v-card-text>
</template>

<script>
import { Contract } from "@/models/ContractModel";
import ContractDurationInput from "@/components/contracts/ContractDurationInput";

export default {
  name: "ContractFormFields",
  components: { ContractDurationInput },
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
  },
  methods: {
    setDates(event) {
      this.contract.startDate = event.startDate;
      this.contract.endDate = event.endDate;
    }
  }
};
</script>

<style scoped></style>
