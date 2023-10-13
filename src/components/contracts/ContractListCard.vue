<template>
  <v-card class="mx-auto" max-width="350" outlined>
    <v-card-title>
      <span class="primary--text text-subtitle-2">
        {{ $t("contracts.perMonth", { time: worktime }) }}
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
        <ConfirmationDialog
          :confirmation-button="{ text: $t('actions.delete'), color: 'error' }"
          @confirm="destroyFn"
        >
          <template #activator="{ on }">
            <v-btn text data-cy="delete" v-on="on">
              {{ $t("actions.delete") }}
            </v-btn>
          </template>

          <template #title>
            {{
              $t("buttons.deleteEntity", {
                entity: $tc(`models.contract`)
              })
            }}
          </template>

          <template #text>
            {{
              $t(`dialogs.textConfirmDelete`, {
                selectedEntity: $tc(`models.selectedContract`)
              })
            }}
          </template>
          <template #consequencesText>
            {{ $t("dialogs.contractDeleteConsequences") }}
          </template>
        </ConfirmationDialog>
      </div>
    </v-card-actions>
    <v-overlay absolute :value="expired" color="grey lighten-1" />
  </v-card>
</template>

<script>
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { localizedFormat } from "@/utils/date";
import { minutesToHHMM } from "@/utils/time";
import { Contract } from "@/models/ContractModel";
import ContractFormDialog from "@/components/forms/dialogs/ContractFormDialog";
import { ContractService } from "@/services/models";

function formatDate(date) {
  return localizedFormat(date, "do MMMM yyyy");
}

export default {
  name: "ContractListCard",
  components: { ContractFormDialog, ConfirmationDialog },
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
    worktime() {
      return minutesToHHMM(this.contract.minutes);
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
