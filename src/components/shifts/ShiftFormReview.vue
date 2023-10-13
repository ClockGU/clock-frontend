<template>
  <v-checkbox
    v-model="wasReviewed"
    :indeterminate="indeterminate"
    :prepend-icon="icons.mdiProgressCheck"
    :label="label"
    :style="`--color: ${color}`"
    class="mt-0 pt-0 disable-input"
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
    indeterminate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      icons: { mdiProgressCheck },
      wasReviewed: this.value
    };
  },
  computed: {
    label() {
      return this.wasReviewed
        ? this.$t("shifts.reviewed")
        : this.$t("shifts.planned");
    },
    color() {
      return this.wasReviewed ? "#94cf96" : "#fdba66";
    }
  },
  watch: {
    value(val) {
      this.wasReviewed = val;
    }
  }
};
</script>

<style scoped>
.disable-input :deep(.v-label) {
  color: var(--color) !important;
  width: 100%;
  opacity: 1;
}
.disable-input :deep(.v-icon) {
  color: var(--color) !important;
}
.disable-input {
  pointer-events: none;
  cursor: default;
}
</style>
