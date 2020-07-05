<template>
  <v-card outlined>
    <v-card-title>
      <span>
        Zusammenfassung
      </span>
      <v-spacer></v-spacer>
      <v-chip v-if="exported" outlined color="primary">
        {{ $t("reports.exported") }}
      </v-chip>
    </v-card-title>

    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr v-for="row in rows" :key="row.name">
              <td>{{ row.name }}</td>
              <td>{{ row.value }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
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
              :disabled="!isFirstUnlockedMonth && !exported"
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
            <ConfirmationDialog
              :confirmation-button="{ text: 'Confirm', color: 'error' }"
              @confirm="lock"
            >
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
                Lock month?
              </template>

              <template v-slot:text>
                When you lock the month, you will not be able to edit its
                shifts. This will allow you to export the Stundenzettel of the
                next month.
              </template>
            </ConfirmationDialog>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import { format, parseISO, differenceInMinutes } from "date-fns";
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
    },
    shifts: {
      type: Array,
      required: true
    },
    carryover: {
      type: Number,
      required: true
    },
    isFirstUnlockedMonth: {
      type: Boolean,
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
    rows() {
      return [
        {
          name: "Übertrag aus dem letzten Monat",
          value: minutesToHHMM(this.carryover)
        },
        {
          name: "Monatliche Arbeitszeit",
          value: minutesToHHMM(this.debit)
        },
        {
          name: "Geleistete Arbeitszeit",
          value: minutesToHHMM(this.timeWorked)
        },
        {
          name: "Übertrag Folgemonat",
          value: minutesToHHMM(this.report.duration)
        }
      ];
    },
    timeWorked() {
      return this.shifts.reduce((acc, cur) => {
        const dateA = new Date(cur.date.start);
        const dateB = new Date(cur.date.end);

        return acc + differenceInMinutes(dateB, dateA);
      }, 0);
    },
    fileName() {
      const date = format(parseISO(this.report.date), "MMMM'_'yyyy");
      return `${this.$i18n.t("app.reports")}_${date}.pdf`;
    },
    debit() {
      const contract = this.$store.state.contract.contracts.find(
        contract => contract.uuid === this.report.contract
      );

      return contract.minutes;
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
