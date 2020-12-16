<template>
  <v-dialog v-model="dialog" width="500">
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>

    <v-card>
      <v-card-title>{{ $t("shifts.assignContract") }}</v-card-title>
      <v-card-text>
        <span>{{ $t("shifts.assignContractDialog") }}</span>
      </v-card-text>

      <v-card-text>
        <v-select
          v-model="contract"
          :items="contracts"
          :prepend-icon="icons.mdiFileDocumentEditOutline"
          :label="$t('shifts.changeContract')"
          item-text="name"
          item-value="uuid"
          hide-details
          filled
        ></v-select>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" text :loading="loading" @click="save">
          {{ $t("actions.save") }}
        </v-btn>
        <v-btn text @click="dialog = false">{{ $t("actions.cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiFileDocumentEditOutline } from "@mdi/js";
import ShiftService from "@/services/shift";
import { log } from "@/utils/log";

import { mapGetters } from "vuex";

export default {
  name: "ShiftBulkActionsDialogAssignContract",
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
      contracts: "contract/contracts"
    })
  },
  created() {
    this.contract = this.shifts[0].contract;
  },
  methods: {
    async save() {
      const promises = [];
      this.loading = true;
      try {
        for (let item of this.shifts) {
          const payload = item.shift.toPayload();
          payload.contract = this.contract;
          promises.push(ShiftService.update(payload, payload.uuid));
        }

        await Promise.all(promises);

        this.reset();
      } catch (error) {
        // TODO: Set error state for component & allow user to reload page
        // We usually should end up here, if we are already logging out.
        // But a proper error state could mitigate further issues.
        log(error);
      } finally {
        this.loading = false;
        this.dialog = false;
      }
    },
    reset() {
      this.$emit("reset");
    }
  }
};
</script>
