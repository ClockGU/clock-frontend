<template>
  <v-select
    v-model="contract"
    :items="choices"
    :prepend-icon="icons.mdiFileDocumentEditOutline"
    :label="$t('shifts.changeContract')"
    item-text="name"
    item-value="id"
    return-object
    filled
  ></v-select>
</template>

<script>
import { mdiFileDocumentEditOutline } from "@mdi/js";
export default {
  name: "ShiftFormSelectContract",
  props: {
    value: {
      type: String,
      required: true
    },
    choices: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      icons: {
        mdiFileDocumentEditOutline
      },
      contract: null
    };
  },
  watch: {
    value(val) {
      if (val !== "") {
        this.contract = this.$store.getters["contentData/contractById"](val);
      }
    },
    contract(val) {
      this.$emit("input", val.id);
    }
  },
  created() {
    if (this.value !== "") {
      this.contract = this.$store.getters["contentData/contractById"](
        this.value
      );
    } else {
      this.contract = this.$store.getters["selectedContract/selectedContract"];
    }
  }
};
</script>

<style scoped></style>
