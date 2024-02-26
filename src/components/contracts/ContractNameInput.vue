<template>
  <v-text-field
    v-model="name"
    data-cy="input-contract"
    :label="$t('contracts.name')"
    :error-messages="errors"
    :prepend-icon="icons.mdiFolderInformationOutline"
    variant="filled"
    counter="100"
    required
    :disabled="disabled"
    @blur="v$.name.$touch()"
  />
</template>

<script>
import { mdiFolderInformationOutline } from "@mdi/js";
import { useVuelidate } from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";

export default {
  name: "ContractNameInput",
  props: {
    modelValue: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  validations: {
    name: {
      minLength: minLength(2),
      required
    }
  },
  emits: ["update:modelValue"],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      name: "",
      icons: { mdiFolderInformationOutline }
    };
  },
  computed: {
    errors() {
      return this.v$.$errors.map((item) => item.$message);
    }
  },
  watch: {
    modelValue(val) {
      this.name = val;
    },
    name(val) {
      this.$emit("update:modelValue", val);
    }
  },
  created() {
    this.name = this.modelValue;
  }
};
</script>

<style scoped></style>
