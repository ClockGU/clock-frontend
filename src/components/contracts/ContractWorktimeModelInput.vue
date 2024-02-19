<template>
  <v-select
    v-model="selectedWorktimeModel"
    :prepend-icon="icon"
    :items="items"
    :label="$t('contracts.worktimeModelName')"
    item-text="text"
    item-value="value"
    filled
    :disabled="disabled"
    :error-messages="errors"
    @input="v$.selectedWorktimeModel.$touch()"
  >
  </v-select>
</template>

<script>
import { WORKTIME_MODEL_CHOICES } from "@/models/ContractModel";
import { mdiAccountCogOutline } from "@mdi/js";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  name: "ContractWorktimeModelInput",
  props: {
    modelValue: {
      validator: (v) => typeof v === "string" || v === null,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
emits: ['update:model-value'],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      selectedWorktimeModel: this.modelValue,
      icon: mdiAccountCogOutline
    };
  },
  validations: {
    selectedWorktimeModel: {
      required
    }
  },
  computed: {
    items() {
      return WORKTIME_MODEL_CHOICES.map((item) => {
        item["text"] = this.$t(item["localeRef"]);
        return item;
      });
    },
    errors() {
      return this.v$.$errors.map((item) => item.$message);
    }
  },
  watch: {
    modelValue(val) {
      this.selectedWorktimeModel = val;
    },
    selectedWorktimeModel(val) {
      this.$emit("update:model-value", val);
    }
  },
  mounted() {
    this.v$.$validate();
  }
};
</script>

<style scoped></style>
