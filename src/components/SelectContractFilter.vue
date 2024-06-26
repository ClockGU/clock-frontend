<template>
  <v-select
    :readonly="disabled"
    :model-value="disabled ? { uuid: '' } : selectedContract"
    :items="disabled ? [{ uuid: '' }] : contracts"
    :prepend-icon="icons.mdiFileDocumentEditOutline"
    :hint="hint"
    item-title="name"
    persistent-hint
    variant="solo"
    return-object
    :bg-color="bgColor"
    @update:model-value="changeContract"
  >
    <template #selection="{ item }">
      <div v-if="disabled">
        {{ $t("dashboard.disabled.noContract") }}
        <router-link v-if="disabled" to="/contracts">{{
          $t("dashboard.disabled.createContractHere")
        }}</router-link>
      </div>
      <div v-else>
        {{ item.title + contractStatus(item.raw) }}
      </div>
    </template>

    <template #item="{ item, props }">
      <v-list-item
        v-bind="props"
        :subtitle="
          disabled
            ? $t('dashboard.disabled.noContract')
            : contractStatus(item.raw)
        "
      >
      </v-list-item>
    </template>
  </v-select>
</template>

<script>
import { mdiRecord } from "@mdi/js";

import contractValidMixin from "@/mixins/contractValid";
import { mapGetters } from "vuex";

export default {
  name: "SelectContractFilter",
  mixins: [contractValidMixin],
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    icons: { mdiRecord }
  }),
  computed: {
    ...mapGetters({
      contracts: "contentData/allContractsByLastActivity",
      selectedContract: "selectedContract/selectedContract"
    }),
    hint() {
      if (this.disabled) {
        return "";
      }
      return this.contractExpired
        ? this.$t("selectContract.hintExpired")
        : this.$t("selectContract.hint");
    },
    bgColor() {
      if (this.disabled) {
        return undefined;
      }
      return this.contractExpired ? "grey--text text--lighten-2" : undefined;
    }
  },
  methods: {
    async changeContract(contract) {
      if (this.selectedContract === contract) return;
      await this.$store.dispatch("selectedContract/selectContract", contract);
    },
    contractStatus(contract) {
      if (this.specificContractInFuture(contract))
        return " " + this.$t("contracts.inFuture");
      if (this.specificContractExpired(contract))
        return " " + this.$t("contracts.expired");
      else return "";
    }
  }
};
</script>
