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
        {{ $t("reports.creditDebit", { creditDebit }) }}
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="pdf !== null"
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

import { minutesToHHMM } from "@/utils/time";

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
      pdf: null,
      loading: false
    };
  },
  computed: {
    fileName() {
      const date = format(parseISO(this.report.date), "MMMM'_'yyyy");
      return `${this.$i18n.t("app.reports")}_${date}.pdf`;
    },
    debit() {
      const contract = this.$store.state.contract.contracts.find(
        contract => contract.uuid === this.report.contract
      );

      return minutesToHHMM(contract.minutes);
    },
    credit() {
      return minutesToHHMM(this.report.duration);
    },
    creditDebit() {
      return `${this.credit} ${this.$t("reports.of")} ${this.debit}`;
    }
  },
  methods: {
    download() {
      const link = document.createElement("a");
      link.setAttribute("href", `data:application/pdf;base64,${this.pdf}`);
      link.setAttribute("download", this.fileName);
      link.click();
    },
    async request() {
      this.loading = true;
      try {
        const response = await ReportService.get(this.report.uuid);
        this.pdf = Buffer.from(response.data, "binary").toString("base64");
      } catch (error) {
        if (error.response.status === 401) return;
        // TODO: Set error state in component
        const uint8array = new Uint8Array(error.response.data);
        const decoded = JSON.parse(new TextDecoder().decode(uint8array));
        this.$store.dispatch("snackbar/setSnack", {
          snack: decoded.message,
          timeout: 4000,
          color: "error"
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
