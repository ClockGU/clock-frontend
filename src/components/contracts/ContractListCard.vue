<template>
  <v-card
    class="mx-auto"
    max-width="350"
    outlined
    :color="!contractExpired ? undefined : 'grey lighten-3'"
  >
    <v-card-title>
      <span class="primary--text text-subtitle-2">
        {{ $t("contracts.perMonth", { time: worktime }) }}
        {{ !contractExpired ? "" : $t("contracts.expired") }}
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
      <v-btn
        text
        color="primary"
        data-cy="edit"
        @click="$emit('edit', contract.uuid)"
      >
        {{ $t("actions.edit") }}
      </v-btn>

      <ConfirmationDialog @confirm="$emit('delete')">
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
      </ConfirmationDialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { parseISO, endOfDay, isPast } from "date-fns";
import { localizedFormat } from "@/utils/date";
import { minutesToHHMM } from "@/utils/time";

function formatDate(date) {
  return localizedFormat(parseISO(date), "do MMMM yyyy");
}

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
    endDate() {
      return formatDate(this.contract.date.end);
    },
    startDate() {
      return formatDate(this.contract.date.start);
    },
    worktime() {
      return minutesToHHMM(this.contract.worktime);
    },
    contractExpired() {
      const date = endOfDay(parseISO(this.contract.date.end));
      return isPast(date);
    }
  }
};
</script>
