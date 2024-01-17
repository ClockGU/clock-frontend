<template>
  <v-select
    :value="value"
    :items="items"
    label="Type"
    item-text="text"
    item-value="value"
    return-object
    filled
  >
  </v-select>
</template>

<script>
import { WORKTIME_MODEL_CHOICES } from "@/models/ContractModel";

export default {
  name: "ContractWorktimeModelInput",
  props: {
    value: {
      type: [String, typeof null],
      required: true
    }
  },
  data() {
    return {
      selectedWorktimeModel: this.value,
      items: WORKTIME_MODEL_CHOICES
    };
  },

  watch: {
    value(val) {
      this.selectedWorktimeModel = val;
    },
    selectedWorktimeModel(val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style scoped></style>
