<template>
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

    <v-card-actions class="px-1">
      <v-container>
        <v-row align="center">
          <v-col cols="8">
            <span class="subtitle-2">
              Generate and download your Stundenzettel
            </span>
          </v-col>
          <v-col cols="4">
            <v-btn
              v-if="!pdf"
              :loading="loading"
              :outlined="loading"
              color="primary"
              @click="request"
            >
              {{ $t("actions.request") }}
            </v-btn>

            <v-btn
              v-else
              :loading="loading"
              :outlined="loading"
              color="primary"
              @click="download"
            >
              Download
            </v-btn>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col cols="8">
            <span class="subtitle-2">
              Lock the month
            </span>
          </v-col>

          <v-col cols="4">
            <ConfirmationDialog @confirm="lock">
              <template v-slot:activator="{ on }">
                <v-btn
                  :disabled="lockDisabled"
                  :text="!lockDisabled"
                  :color="!lockDisabled ? 'orange' : ''"
                  v-on="on"
                >
                  {{ isLockable ? "Lock" : "Locked" }}
                </v-btn>
              </template>

              <template v-slot:title>
                Test
              </template>

              <template v-slot:text>
                ASD
              </template>
            </ConfirmationDialog>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import { format, parseISO } from "date-fns";
import ReportService from "@/services/report";
import ContractService from "@/services/contract";
import ConfirmationDialog from "@/components/ConfirmationDialog";

import { log } from "@/utils/log";
import { minutesToHHMM } from "@/utils/time";

export default {
  name: "ReportCard",
  filters: {
    formatDate(date) {
      return format(parseISO(date), "MMMM yyyy");
    }
  },
  components: { ConfirmationDialog },
  props: {
    exported: {
      type: Boolean,
      default: false
    },
    report: {
      type: Object,
      required: true
    },
    isLockable: {
      type: Boolean,
      default: false
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
      let credit = minutesToHHMM(this.report.duration);

      if (this.report.duration < 0) {
        credit = `-${credit}`;
      }
      return credit;
    },
    creditDebit() {
      return `${this.credit} ${this.$t("reports.of")} ${this.debit}`;
    },
    lockDisabled() {
      return !this.pdf || !this.isLockable;
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
    },
    async lock() {
      try {
        const date = this.report.date.slice(0, 7);
        const [year, month] = date.split("-");
        await ContractService.lock({
          uuid: this.report.contract,
          year,
          month
        });

        this.$emit("locked");
      } catch (error) {
        log(error);
      }
    }
  }
};
</script>
