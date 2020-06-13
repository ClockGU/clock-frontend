<template>
  <v-col cols="12" sm="6" md="4">
    <v-card outlined>
      <v-card-title>
        <span>
          {{ report.date | formatDate }}
        </span>
        <v-spacer></v-spacer>
        <v-chip v-if="exported" outlined color="primary">
          {{ $t("reports.exported") }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        {{ $t("reports.creditDebit", { hours: creditDebit }) }}
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="pdfResponse"
          :loading="loading"
          :outlined="loading"
          text
          color="primary"
          @click="download"
        >
          Download
        </v-btn>

        <ConfirmationDialog
          v-else
          :confirmation-button="{
            text: $t('actions.continue'),
            color: 'primary'
          }"
          @confirm="request"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              :loading="loading"
              :outlined="loading"
              text
              color="primary"
              v-on="on"
            >
              {{ $t("actions.request") }}
            </v-btn>
          </template>

          <template v-slot:title>
            {{ $t("reports.generate") }}
          </template>

          <template v-slot:text>
            {{ $t("reports.exportAlert") }}
          </template>
        </ConfirmationDialog>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import { format, parseISO } from "date-fns";
import ReportService from "@/services/report";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default {
  name: "ReportCard",
  components: {
    ConfirmationDialog
  },
  filters: {
    formatDate(date) {
      return format(parseISO(date), "MMMM yyyy");
    }
  },
  props: {
    exported: {
      type: Boolean,
      default: false
    },
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
      return `${this.credit} ${this.$t("reports.of")} ${this.debit}`;
    }
  },
  methods: {
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
    async request() {
      this.loading = true;
      const { data } = await ReportService.export(this.report.uuid);
      this.pdfResponse = data;
      this.loading = false;

      this.$store.dispatch("shift/queryShifts");
    }
  }
};
</script>
