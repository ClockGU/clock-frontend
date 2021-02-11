<template>
  <v-select
    :value="selectedContract"
    :items="contracts"
    :prepend-icon="icons.mdiFileDocumentEditOutline"
    :hint="
      contractExpired
        ? $t('selectContract.hintExpired')
        : $t('selectContract.hint')
    "
    item-value="uuid"
    persistent-hint
    solo
    return-object
    :background-color="contractExpired ? 'grey lighten-2' : undefined"
    @input="changeContract"
  >
    <template #selection="contract">
      {{
        contract.item.name +
        (specificContractExpired(contract.item)
          ? " " + $t("contracts.expired")
          : "")
      }}
    </template>

    <template #item="contract">
      {{
        contract.item.name +
        (specificContractExpired(contract.item)
          ? " " + $t("contracts.expired")
          : "")
      }}
    </template>
  </v-select>
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
  computed: {
    xyz() {
      return "hugo";
    }
  },
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
