<template>
  <v-checkbox
    v-model="wasReviewed"
    :error-messages="errorMessage"
    :disabled="disabled"
    :indeterminate="indeterminate"
    :success="wasReviewed"
    :prepend-icon="icons.mdiProgressCheck"
    :label="$t('shifts.reviewed')"
    class="mt-0 pt-0"
  ></v-checkbox>
</template>

<script>
import { mdiProgressCheck } from "@mdi/js";

export default {
  name: "ShiftFormReview",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      icons: { mdiProgressCheck },
      wasReviewed: this.value
    };
  },
  watch: {
    value(val) {
      this.wasReviewed = val;
    },
    wasReviewed(val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style scoped></style>
