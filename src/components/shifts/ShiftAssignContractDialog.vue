<template>
  <v-dialog v-model="dialog" width="500" transition="dialog-bottom-transition">
    <template #activator="props">
      <slot name="activator" v-bind="props"></slot>
    </template>

    <v-card>
      <v-card-title>{{ $t("shifts.assignContract") }}</v-card-title>
      <v-card-text>
        <span>{{ $tc("shifts.assignContractDialog", shifts.length) }}</span>
      </v-card-text>
      <v-card-text>
        <v-select
          v-model="contract"
          :items="validContracts"
          :prepend-icon="icons.mdiFileDocumentEditOutline"
          :label="$t('shifts.changeContract')"
          item-title="name"
          item-value="id"
          return-object
          hide-details
          variant="filled"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="text" :loading="loading" @click="save">
          {{ $t("actions.save") }}
        </v-btn>
        <v-btn variant="text" @click="dialog = false">{{
          $t("actions.cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
:
<script>
import { mdiFileDocumentEditOutline } from "@mdi/js";
import contractValidMixin from "@/mixins/contractValid";

import { mapGetters } from "vuex";

export default {
  name: "ShiftAssignContractDialog",
  mixins: [contractValidMixin],
  props: {
    shifts: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    contract: null,
    dialog: false,
    loading: false,
    icons: { mdiFileDocumentEditOutline }
  }),
  computed: {
    ...mapGetters({
      contracts: "contentData/allContracts"
    }),
    validContracts() {
      return this.contracts.filter(
        // TODO: check for shift date or date range (bulk assign)
        (contract) => !this.specificContractExpired(contract)
      );
    }
  },
  created() {
    this.contract = this.$store.getters["selectedContract/selectedContract"];
  },
  methods: {
    save() {
      this.$emit("save", this.contract);
      this.dialog = false;
    }
  }
};
</script>
