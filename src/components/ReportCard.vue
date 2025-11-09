<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      :ripple="false"
      v-bind="hoverProps"
      v-on="disabled ? { click: () => toggleTouchOverlay(isHovering) } : {}"
      tabindex="0"
      role="region"
      :aria-labelledby="`report-card-title`"
    >
      <v-card-title>
        <h2 id="report-card-title" class="text-h6">
          {{ $t("aria.report.summary") }}
        </h2>
        <v-spacer></v-spacer>
        <v-chip v-if="exported" variant="outlined" color="primary">
          {{ $t("reports.exported") }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        <div aria-live="polite" aria-atomic="true" class="sr-only">
          {{ $t("reports.summary") }}:
          {{ rows.map((r) => `${r.name}: ${r.value}`).join(", ") }}
        </div>
        <v-table>
          <template #default>
            <thead>
              <tr>
                <th scope="col">{{ $t("aria.table.label") }}</th>
                <th scope="col" class="text-right">
                  {{ $t("aria.table.value") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in rows"
                :key="row.name"
                tabindex="0"
                role="row"
                :aria-label="`${row.name}, ${row.value}`"
              >
                <td role="cell">{{ row.name }}</td>
                <td role="cell" class="text-right">{{ row.value }}</td>
              </tr>
            </tbody>
          </template>
        </v-table>
        <div v-if="pdf" aria-live="polite" aria-atomic="true" class="sr-only">
          {{ $t("aria.report.readyForDownload") }}
        </div>
      </v-card-text>

      <v-card-actions class="px-1">
        <v-container>
          <!-- Request/Download Section -->
          <div
            role="group"
            :aria-label="
              $t(
                pdf
                  ? 'aria.report.downloadSection'
                  : 'aria.report.requestSection'
              )
            "
            tabindex="0"
          >
            <v-row align="center">
              <v-col cols="8">
                <span class="text-subtitle-2" aria-hidden="true">
                  1. {{ $t("reports.generate") }}
                </span>

                <p class="text-caption" aria-hidden="true">
                  {{ $t("reports.hints.request") }}

                  <span
                    v-if="!isExportable"
                    id="personnel-warning"
                    class="text-caption warn"
                    aria-hidden="false"
                  >
                    {{ $t("reports.hints.personnelnumber") }}
                  </span>
                </p>
              </v-col>

              <v-col cols="4">
                <v-btn
                  v-if="!pdf"
                  :loading="loading"
                  :variant="loading ? 'outlined' : 'elevated'"
                  :disabled="!isFirstUnlockedMonth && !exported"
                  color="primary"
                  @click="request"
                  :aria-label="$t('aria.report.requestButton')"
                  :aria-describedby="!isExportable ? 'personnel-warning' : null"
                >
                  {{ $t("actions.request") }}
                </v-btn>

                <v-btn
                  v-else
                  :loading="loading"
                  :variant="loading ? 'outlined' : 'elevated'"
                  color="primary"
                  @click="download"
                  :aria-label="$t('aria.report.downloadButton')"
                >
                  {{ $t("actions.download") }}
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <!-- Lock Section -->
          <div
            role="group"
            :aria-label="$t('aria.report.lockSection')"
            tabindex="0"
          >
            <v-row align="center">
              <v-col cols="8">
                <span class="text-subtitle-2" aria-hidden="true">
                  2. {{ $t("reports.lock.label") }}
                </span>

                <p class="text-caption" aria-hidden="true">
                  {{ $t("reports.hints.lock") }}
                </p>
              </v-col>

              <v-col cols="4">
                <ConfirmationDialog
                  :confirmation-button="{
                    text: $t('actions.confirm'),
                    color: 'error'
                  }"
                  @confirm="lock"
                >
                  <template #activator="{ props: confirmationProps }">
                    <v-btn
                      :disabled="lockDisabled"
                      :loading="lockLoading"
                      :variant="!lockDisabled ? 'text' : 'elevated'"
                      :color="!lockDisabled ? 'warning' : ''"
                      v-bind="confirmationProps"
                      role="button"
                      :aria-label="
                        isLockable
                          ? $t('aria.report.lockButton')
                          : $t('aria.report.lockedButton')
                      "
                    >
                      <span class="sr-only">
                        {{
                          isLockable
                            ? $t("aria.report.lockButton")
                            : $t("aria.report.lockedButton")
                        }}
                      </span>
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
                    <v-alert
                      v-if="showCurrentMonthLockWarning"
                      type="warning"
                      prominent
                      class="mb-4"
                      role="alert"
                      aria-live="assertive"
                      aria-atomic="true"
                      tabindex="0"
                      :aria-label="
                        $t('reports.lock.currentMonthWarning')
                      "
                    >
                      {{ $t("reports.lock.currentMonthWarning") }}
                    </v-alert>
                    <p>{{ $t("reports.lock.message") }}</p>
                  </template>
                </ConfirmationDialog>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-card-actions>

      <v-overlay
        :model-value="disabled && (isHovering || touchOverlay)"
        contained
        scrim="primary"
        style="align-items: start; justify-content: center"
      >
        <p style="margin-top: 17%; color: white; text-align: center">
          {{ $t("dashboard.disabled.reportHere") }}
        </p>
      </v-overlay>
    </v-card>
  </v-hover>
</template>

<script>
import { parseISO, isSameMonth, endOfMonth, differenceInDays } from "date-fns";
import { localizedFormat } from "@/utils/date";
import { ReportService } from "@/services/models";
import { ContractService } from "@/services/models";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { Buffer } from "buffer";
import { log } from "@/utils/log";
import { mapGetters } from 'vuex';


export default {
  name: "ReportCard",
  components: { ConfirmationDialog },
  props: {
    disabled: Boolean,
    exported: Boolean,
    report: {
      type: Object,
      default: () => ({})
    },
    isExportable: Boolean,
    isLockable: Boolean,
    isFirstUnlockedMonth: {
      type: Boolean,
      required: true
    }
  },
  emits: ["locked"],
  data() {
    return {
      pdf: null,
      loading: false,
      lockLoading: false,
      touchOverlay: false
    };
  },
  computed: {
    ...mapGetters({
      selectedContract: 'selectedContract/selectedContract'
    }),
    rows() {
      return [
        {
          name: this.$t("reports.carryoverLast"),
          value: this.report.carryOverPreviousMonth
        },
        {
          name: this.$t("reports.debit"),
          value: this.report.debitWorktime
        },
        {
          name: this.$t("reports.timeWorked"),
          value: this.report.worktime
        },
        {
          name: this.$t("reports.carryoverNext"),
          value: this.report.carryover
        }
      ];
    },
    fileName() {
      const date = localizedFormat(this.report.monthYear, "MMMM'_'yyyy");
      return `${this.$i18n.t("app.reports")}_${date}.pdf`;
    },
    lockDisabled() {
      return !this.pdf || !this.isLockable;
    },
    // show warning if current month report is being locked with more than 3 days left until month end or contract end
    showCurrentMonthLockWarning() {
      const today = new Date();
      const bufferDays = 3;
      const reportMonth = this.report.monthYear;

      if (!reportMonth || !isSameMonth(reportMonth, today)) {
        return false;
      }

      let lockDeadline = endOfMonth(reportMonth);
      // Check for  contract end and set it as deadline if it is on same month as report to handle mid-month contract ends
      const contractEndDateString = this.selectedContract?.endDate;
      if (contractEndDateString) {
          const contractEndDate = parseISO(contractEndDateString);
          if (isSameMonth(contractEndDate, reportMonth) && contractEndDate < lockDeadline) {
              lockDeadline = contractEndDate;
          }
      }
      const daysRemaining = differenceInDays(lockDeadline, today);
      return daysRemaining > bufferDays;
    }
  },
  methods: {
    toggleTouchOverlay(hover) {
      this.touchOverlay = hover ? false : !this.touchOverlay;
    },
    download() {
      // iOS Safari doesn't handle data URLs well, so we use Blob and URL.createObjectURL
      // Convert base64 to binary
      const binaryString = window.atob(this.pdf);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create Blob and URL
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Create link and trigger download
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", this.fileName);

      // Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the URL object
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    },
    async request() {
      this.loading = true;
      try {
        const response = await ReportService.get(this.report.id);
        this.pdf = Buffer.from(response.data, "binary").toString("base64");
      } catch (error) {
        if (error.response.status === 401) return;
        const uint8array = new Uint8Array(error.response.data);
        const decoded = JSON.parse(new TextDecoder().decode(uint8array));
        await this.$store.dispatch("snackbar/setSnack", {
          message: decoded.message,
          color: "error"
        });
      } finally {
        this.loading = false;
      }
    },
    async lock() {
      this.lockLoading = true;
      try {
        await ContractService.lock({
          id: this.report.contract,
          year: this.report.monthYear.getFullYear(),
          month: this.report.monthYear.getMonth() + 1
        });
        await this.$store.dispatch(
          "contentData/updateContractsShifts",
          this.report.contract
        );
        this.$emit("locked");
      } catch (error) {
        log(error);
      } finally {
        this.lockLoading = false;
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
