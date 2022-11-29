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
import { mapGetters } from "vuex";
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
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract/selectedContract"
    })
  },
  watch: {
    value(val) {
      if (val === "") {
        this.contract = this.selectedContract;
      } else {
        this.contract = this.$store.getters["contentData/contractById"](val);
      }
      if (this.contract.id === this.selectedContract.id) {
        this.$emit("input", this.contract.id);
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
