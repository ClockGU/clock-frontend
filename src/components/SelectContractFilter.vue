<template>
  <v-select
    :value="selectedContract"
    :items="contracts"
    :prepend-icon="icons.mdiFileDocumentEditOutline"
    :hint="contractExpired ? $t('selectContract.hintExpired') : $t('selectContract.hint')"
    item-text="name"
    item-value="uuid"
    persistent-hint
    solo
    return-object
    @input="changeContract"
  ></v-select>
</template>

<script>
import { log } from "@/utils/log";
import { mdiRecord } from "@mdi/js";

import contractExpiredMixin from "@/mixins/contractExpired";

export default {
  name: "SelectContractFilter",
  mixins: [contractExpiredMixin],
  props: {
    contracts: {
      type: Array,
      required: true
    },
    selectedContract: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    icons: { mdiRecord }
  }),
  methods: {
    changeContract({ uuid }) {
      if (this.$route.params.contract === uuid) return;

      this.$emit("update");

      this.$router
        .push({
          ...this.$route.name,
          params: { ...this.$route.name.params, contract: uuid }
        })
        .catch((error) => {
          log("Experienced an error while trying to change contracts: ", error);
        });
    }
  }
};
</script>
