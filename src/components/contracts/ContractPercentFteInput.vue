<template>
  <v-text-field
    v-model="percent"
    :prepend-icon="icons.mdiTimetable"
    :error-messages="errors"
    :label="$t('contracts.percentFte.dataLabel')"
    :hint="$t('contracts.percentFte.hint')"
    single-line
    filled
    type="number"
    persistent-hint
    @input="v$.percent.$touch()"
    @blur="v$.percent.$touch()"
  />
</template>

<script>
import { mdiTimetable } from "@mdi/js";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

const validPercent = (value) => {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return false;
  return 0.0 < parsed && parsed <= 100.0;
};
export default {
  name: "ContractPercentFteInput",
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  validations() {
    let validations = {
      percent: {
        validPercent: helpers.withMessage(
          this.$t("errors.invalidPercentage"),
          validPercent
        )
      }
    };
    if (this.required) {
      validations.percent.required = required;
    }
    return validations;
  },
  emits: ["update:modelValue"],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      percent: this.modelValue || null,
      icons: { mdiTimetable }
    };
  },
  computed: {
    errors() {
      return this.v$.$errors.map((item) => item.$message);
    }
  },
  watch: {
    modelValue(val) {
      this.percent = val;
    },
    percent(val) {
      if (!this.v$.$error) {
        this.$emit("update:modelValue", parseFloat(val));
      }
    }
  }
};
</script>

<style scoped></style>
