<template>
  <v-card
    :class="['mx-auto', isDarkmode ? 'faded-color-dm' : 'faded-color']"
    max-width="350"
    variant="outlined"
    :style="{
      'border-color': contract.color,
      'background-color': contract.color
    }"
  >
    <v-card-title>
      <span class="text-primary text-subtitle-2">
        {{ contract.worktimeRepresentation() }}
        {{ !expired ? "" : $t("contracts.expired") }}
      </span>
    </v-card-title>

    <v-card-text>
      <h2 class="text-h6 primary-text">{{ contract.name }}</h2>
      {{
        $t("contracts.fromTo", {
          start: startDate,
          end: endDate
        })
      }}
    </v-card-text>

    <v-card-actions data-cy="contract-actions">
      <ContractFormDialog :contract="contract" text-button></ContractFormDialog>
      <div style="z-index: 6">
        <ModelDeleteConfirmationDialog :delete-fn="destroyFn" model-name="contract"></ModelDeleteConfirmationDialog>
      </div>
    </v-card-actions>
    <v-overlay absolute :value="expired" color="grey lighten-1" />
  </v-card>
</template>

<script>
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { localizedFormat } from "@/utils/date";
import { minutesToHHMM } from "@/utils/time";
import { Contract } from "@/models/ContractModel";
import ContractFormDialog from "@/components/forms/dialogs/ContractFormDialog.vue";
import { ContractService } from "@/services/models";
import ModelDeleteConfirmationDialog from "@/components/cards/ModelDeleteConfirmationDialog.vue";

function formatDate(date) {
  return localizedFormat(date, "do MMMM yyyy");
}

export default {
  name: "ContractListCard",
  components: { ModelDeleteConfirmationDialog, ContractFormDialog },
  props: {
    contract: {
      type: Contract,
      required: true
    },
    expired: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    endDate() {
      return formatDate(this.contract.endDate);
    },
    startDate() {
      return formatDate(this.contract.startDate);
    },
    isDarkmode() {
      return this.$vuetify.theme.name === "dark";
    }
  },
  methods: {
    async destroyFn() {
      await ContractService.delete(this.contract.id);
      this.$store.commit("contentData/removeContract", {
        contractID: this.contract.id
      });
    }
  }
};
</script>

<style lang="css">
.faded-color {
  background-image: linear-gradient(
    to right,
    white 0%,
    white 88%,
    rgba(255, 255, 255, 0) 100%
  );
}
.faded-color-dm {
  background-image: linear-gradient(
    to right,
    #424242 0%,
    #424242 88%,
    rgba(255, 255, 255, 0) 100%
  );
}
</style>
