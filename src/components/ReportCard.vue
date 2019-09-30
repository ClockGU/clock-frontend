<template>
  <v-col cols="12" sm="6" md="4">
    <v-card outlined>
      <v-card-title>
        <span>
          {{ report.date | formatDate }}
        </span>
        <v-spacer></v-spacer>
        <v-chip v-if="report.exported" outlined color="primary">
          Exported
        </v-chip>
      </v-card-title>

      <v-card-text>Credit/Debit: {{ creditDebit }} hours</v-card-text>

      <v-card-actions>
        <v-btn v-if="report.exported" text color="primary">
          Review
        </v-btn>
        <v-btn v-else text color="primary">
          View
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import { format, parseISO } from "date-fns";

export default {
  name: "ReportCard",
  filters: {
    formatDate(date) {
      return format(parseISO(date), "MMMM yyyy");
    }
  },
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  computed: {
    debit() {
      const contract = this.$store.state.contract.contracts.find(
        contract => contract.uuid === this.report.contract
      );

      return contract.hours.toFixed(1);
    },
    credit() {
      return (this.report.duration / 60).toFixed(1);
    },
    creditDebit() {
      return `${this.credit} of ${this.debit}`;
    }
  }
};
</script>
