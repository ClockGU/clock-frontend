<template>
  <v-select
    :prepend-icon="icon"
    :value="value"
    :items="items"
    :label="$t('contracts.worktimeModelName')"
    item-text="text"
    item-value="value"
    return-object
    filled
  >
  </v-select>
</template>

<script>
import { WORKTIME_MODEL_CHOICES } from "@/models/ContractModel";
import { mdiAccountCogOutline } from "@mdi/js";

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
      icon: mdiAccountCogOutline
    };
  },
  computed: {
    items() {
      return WORKTIME_MODEL_CHOICES.map((item) => {
        item["text"] = this.$t(item["localeRef"]);
        return item;
      });
    }
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
