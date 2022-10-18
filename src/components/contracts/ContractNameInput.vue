<template>
  <v-text-field
    v-model="name"
    data-cy="input-contract"
    :label="$t('contracts.name')"
    :error-messages="errors"
    :prepend-icon="icons.mdiFolderInformationOutline"
    filled
    counter="100"
    required
    :disabled="disabled"
    @blur="$v.name.$touch()"
  />
</template>

<script>
import { mdiFolderInformationOutline } from "@mdi/js";

export default {
  name: "ContractNameInput",
  props: {
    value: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    errors: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      name: "",
      icons: { mdiFolderInformationOutline }
    };
  },
  watch: {
    value(val) {
      this.name = val;
    },
    name(val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style scoped></style>
