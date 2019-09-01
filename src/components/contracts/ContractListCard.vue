<template>
  <v-col cols="12" sm="12" md="6">
    <v-card class="mx-auto" max-width="350" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">
            {{ contract.hours | hoursToWorktime }} per month
          </div>
          <v-list-item-title class="headline mb-1">
            {{ contract.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ contract.date.start | toDate }} until
            {{ contract.date.end | toDate }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="error" @click="$emit('delete')">Delete</v-btn>
        <v-btn
          text
          :to="{
            name: 'editContract',
            params: { uuid: contract.uuid }
          }"
          >Edit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import { format } from "date-fns";

export default {
  name: "ContractListCard",
  filters: {
    toDate(date) {
      return format(date, "YYYY-MM-DD");
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
