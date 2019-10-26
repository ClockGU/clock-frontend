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
        <v-btn
          v-else
          :loading="loading"
          :outlined="loading"
          text
          color="primary"
          @click="action"
        >
          {{ downloadLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import { format, parseISO } from "date-fns";
import ReportService from "@/services/report.service";

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
  data() {
    return {
      pdfResponse: null,
      loading: false
    };
  },
  computed: {
    fileName() {
      const date = format(parseISO(this.report.date), "MMMM'_'yyyy");
      return `Report_${date}.pdf`;
    },
    downloadLabel() {
      return !this.pdfResponse ? "Request" : "Download";
    },
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
  },
  methods: {
    action() {
      if (!this.pdfResponse) {
        this.requestDownload();
        return;
      }

      this.download();
    },
    download() {
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(
        new Blob([this.pdfResponse], { type: "application/pdf" })
      );
      link.download = this.fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async requestDownload() {
      this.loading = true;
      const { data } = await ReportService.export(this.report.uuid);
      this.pdfResponse = data;
      this.loading = false;
    }
  }
};
</script>
