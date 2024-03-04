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
    value: {
      validator: (v) => typeof v === "string" || v === null,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      selectedWorktimeModel: this.value,
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
    value(val) {
      this.selectedWorktimeModel = val;
    },
    selectedWorktimeModel(val) {
      this.$emit("input", val);
    }
  },
  mounted() {
    this.v$.$validate();
  }
};
</script>

<style scoped></style>
