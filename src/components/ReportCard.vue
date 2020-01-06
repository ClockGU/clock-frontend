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
        <v-btn
          :loading="loading"
          :outlined="loading"
          text
          color="primary"
          @click="action"
        >
          {{ downloadLabel }}
        </v-btn>

        <!-- <v-btn v-if="exported" text @click="resetExport">
          Reset
        </v-btn> -->
      </v-card-actions>
    </v-card>

    <TheDialog v-if="requestDialog" @close="requestDialog = false">
      <template v-slot:content>
        <v-card>
          <v-card-title>Generate report</v-card-title>

          <v-card-text
            >Once you generate the report, you will not be able to add or update
            shifts in the corresponding month
          </v-card-text>

          <v-card-actions>
            <v-btn text color="primary" @click="requestDownload">
              Continue
            </v-btn>
            <v-btn text @click="requestDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </TheDialog>
  </v-col>
</template>

<script>
import { format, parseISO, isThisMonth } from "date-fns";
import ReportService from "@/services/report";
import TheDialog from "@/components/TheDialog";

import { mapGetters } from "vuex";

export default {
  name: "ReportCard",
  components: {
    TheDialog
  },
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
      requestDialog: false,
      pdfResponse: null,
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      currentShifts: "shift/currentShifts"
    }),
    exported() {
      return isThisMonth(parseISO(this.report.date));
    },
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
        this.requestDialog = true;
        // this.requestDownload();
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
      this.requestDialog = false;
      const { data } = await ReportService.export(this.report.uuid);
      this.pdfResponse = data;
      this.loading = false;
    }
    // resetExport() {
    //   console.log("reset report!");
    // }
  }
};
</script>
