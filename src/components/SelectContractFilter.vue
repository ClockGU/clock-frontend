<template>
  <v-select
    :readonly="disabled"
    :value="disabled ? { uuid: '' } : selectedContract"
    :items="disabled ? [{ uuid: '' }] : contracts"
    :prepend-icon="icons.mdiFileDocumentEditOutline"
    :hint="hint"
    item-value="uuid"
    persistent-hint
    solo
    return-object
    :background-color="bgColor"
    @input="changeContract"
  >
    <template #selection="contract">
      <div v-if="disabled">
        {{ $t("dashboard.disabled.noContract") }}
        <router-link v-if="disabled" to="/contracts">{{
          $t("dashboard.disabled.createContractHere")
        }}</router-link>
      </div>
      <div v-else>
        {{ contract.item.name + contractStatus(contract.item) }}
      </div>
    </template>

    <template #item="contract">
      {{
        disabled
          ? $t("dashboard.disabled.noContract")
          : contract.item.name + contractStatus(contract.item)
      }}
    </template>
  </v-select>
</template>

<script>
import { log } from "@/utils/log";
import { mdiRecord } from "@mdi/js";

import contractValidMixin from "@/mixins/contractValid";

export default {
  name: "SelectContractFilter",
  mixins: [contractValidMixin],
  props: {
    contracts: {
      type: Array,
      required: true
    },
    selectedContract: {
      type: Object,
      required: true
    },
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
      return this.contractExpired ? "grey lighten-2" : undefined;
    }
  },
  methods: {
    changeContract({ uuid }) {
      if (this.$route.params.contract === uuid) return;
      this.$store.dispatch("setContract", uuid);
      this.$emit("update");

      this.$router
        .push({
          ...this.$route.name,
          params: { ...this.$route.params, contract: uuid }
        })
        .catch((error) => {
          log("Experienced an error while trying to change contracts: ", error);
        });
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
