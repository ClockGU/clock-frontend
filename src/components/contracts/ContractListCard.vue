<template>
  <v-card class="mx-auto" max-width="350" outlined>
    <v-card-title>
      <span class="primary--text text-subtitle-2">
        {{ $t("contracts.perMonth", { time: worktime }) }}
      </span>
    </v-card-title>

    <v-card-text>
      <h2 class="text-h6 primary-text">{{ contract.name }}</h2>
      {{
        $t("contracts.fromTo", {
          start: contract.date.start,
          end: contract.date.end
        })
      }}
    </v-card-text>

    <v-card-actions data-cy="contract-actions">
      <v-btn
        text
        color="primary"
        data-cy="edit"
        @click="$emit('edit', contract.uuid)"
      >
        {{ $t("actions.edit") }}
      </v-btn>

      <ConfirmationDialog @confirm="$emit('delete')">
        <template v-slot:activator="{ on }">
          <v-btn text data-cy="delete" v-on="on">
            {{ $t("actions.delete") }}
          </v-btn>
        </template>

        <template v-slot:title>
          {{
            $t("buttons.deleteEntity", {
              entity: $tc(`models.contract`)
            })
          }}
        </template>

        <template v-slot:text>
          {{
            $t(`dialogs.textConfirmDelete`, {
              selectedEntity: $tc(`models.selectedContract`)
            })
          }}
        </template>
      </ConfirmationDialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import ConfirmationDialog from "@/components/ConfirmationDialog";

import { minutesToHHMM } from "@/utils/time";

export default {
  name: "ContractListCard",
  components: { ConfirmationDialog },
  props: {
    contract: {
      type: Object,
      required: true
    }
  },
  computed: {
    worktime() {
      return minutesToHHMM(this.contract.minutes);
    }
  }
};
</script>
