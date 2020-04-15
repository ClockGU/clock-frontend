<template>
  <v-card class="mx-auto" max-width="350" outlined>
    <v-card-title>
      <span class="primary--text subtitle-2">
        {{ contract.hours | hoursToWorktime }} per month
      </span>
    </v-card-title>

    <v-card-text>
      <h2 class="title primary-text">{{ contract.name }}</h2>
      {{ contract.date.start | toDate }} until
      {{ contract.date.end | toDate }}
    </v-card-text>

    <v-card-actions data-cy="contract-actions">
      <v-btn
        text
        color="primary"
        data-cy="edit"
        @click="$emit('edit', contract.uuid)"
      >
        Edit
      </v-btn>

      <ConfirmationDialog @confirm="$emit('delete')">
        <template v-slot:activator="{ on }">
          <v-btn text data-cy="delete" v-on="on">Delete</v-btn>
        </template>

        <template v-slot:title>Delete contract?</template>

        <template v-slot:text>
          This will delete all shifts created inside this contract. This action
          is not reversible.
        </template>
      </ConfirmationDialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import { format, parseISO } from "date-fns";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default {
  name: "ContractListCard",
  components: { ConfirmationDialog },
  filters: {
    toDate(date) {
      return format(parseISO(date), "yyyy-MM-dd");
    },
    hoursToWorktime(value) {
      const hours = Math.floor(value);
      const minutes = parseInt((60 * (value - hours)).toFixed(0));

      return `${hours.pad(2)}:${minutes.pad(2)}`;
    }
  },
  props: {
    contract: {
      type: Object,
      required: true
    }
  }
};
</script>
