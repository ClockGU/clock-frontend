<template>
  <v-card outlined>
    <v-card-title>
      <span>
        {{ $t("reports.summary") }}
      </span>
      <v-spacer></v-spacer>
      <v-chip v-if="exported" outlined color="primary">
        {{ $t("reports.exported") }}
      </v-chip>
    </v-card-title>

    <v-card-text>
      <v-simple-table>
        <template #default>
          <tbody>
            <tr v-for="row in rows" :key="row.name">
              <td>{{ row.name }}</td>
              <td class="text-right">{{ row.value }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>

    <v-card-actions class="px-1">
      <v-container>
        <v-row align="center">
          <v-col cols="8">
            <span class="subtitle-2"> 1. {{ $t("reports.generate") }} </span>

            <p class="caption">
              {{ $t("reports.hints.request") }}

              <span v-if="!isExportable" class="caption warn">
                {{ $t("reports.hints.personnelnumber") }}
              </span>
            </p>
          </v-col>
          <v-col cols="4">
            <v-btn
              v-if="!pdf"
              :loading="loading"
              :outlined="loading"
              :disabled="(!isFirstUnlockedMonth && !exported) || !isExportable"
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
              {{ $t("actions.download") }}
            </v-btn>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col cols="8">
            <span class="subtitle-2"> 2. {{ $t("reports.lock.label") }} </span>

            <p class="caption">{{ $t("reports.hints.lock") }}</p>
          </v-col>

          <v-col cols="4">
            <ConfirmationDialog
              :confirmation-button="{
                text: $t('actions.confirm'),
                color: 'error'
              }"
              @confirm="lock"
            >
              <template #activator="{ on }">
                <v-btn
                  :disabled="lockDisabled"
                  :text="!lockDisabled"
                  :color="!lockDisabled ? 'warning' : ''"
                  v-on="on"
                >
                  {{
                    isLockable
                      ? $t("reports.lock.lock")
                      : $t("reports.lock.locked")
                  }}
                </v-btn>
              </template>

              <template #title>
                {{ $t("reports.lock.confirm") }}
              </template>

              <template #text>
                {{ $t("reports.lock.message") }}
              </template>
            </ConfirmationDialog>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import { parseISO, differenceInMinutes } from "date-fns";
import { localizedFormat } from "@/utils/date";
import ReportService from "@/services/report";
import ContractService from "@/services/contract";
import ConfirmationDialog from "@/components/ConfirmationDialog";

import { log } from "@/utils/log";

export default {
  name: "ReportCard",
  filters: {
    formatDate(date) {
      return localizedFormat(parseISO(date), "MMMM yyyy");
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
    isExportable: {
      type: Boolean,
      default: false
    },
    isLockable: {
      type: Boolean,
      default: false
    },
    shifts: {
      type: Array,
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
          name: this.$t("reports.carryoverLast"),
          value: this.report.carryover.prev
        },
        {
          name: this.$t("reports.debit"),
          value: this.report.debit_worktime
        },
        {
          name: this.$t("reports.timeWorked"),
          value: this.report.net_worktime
        },
        {
          name: this.$t("reports.carryoverNext"),
          value: this.report.carryover.next
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
      const date = localizedFormat(parseISO(this.report.date), "MMMM'_'yyyy");
      return `${this.$i18n.t("app.reports")}_${date}.pdf`;
    },
    downloadLabel() {
      return !this.pdfResponse ? "Request" : "Download";
    },
    debit() {
      const contract = this.$store.state.contract.contracts.find(
        (contract) => contract.uuid === this.report.contract
      );

      return contract.worktime;
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

<style lang="scss" scoped>
.warn {
  color: #ff5252;
}
</style>
