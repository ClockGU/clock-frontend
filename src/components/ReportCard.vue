<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      :ripple="false"
      v-bind="hoverProps"
      v-on="disabled ? { click: () => toggleTouchOverlay(isHovering) } : {}"
    >
      <v-card-title>
        <span>
          {{ $t("reports.summary") }}
        </span>
        <v-spacer></v-spacer>
        <v-chip v-if="exported" variant="outlined" color="primary">
          {{ $t("reports.exported") }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        <v-table>
          <template #default>
            <tbody>
              <tr v-for="row in rows" :key="row.name">
                <td>{{ row.name }}</td>
                <td class="text-right">{{ row.value }}</td>
              </tr>
            </tbody>
          </template>
        </v-table>
      </v-card-text>
      <v-card-actions class="px-1">
        <v-container>
          <v-row align="center">
            <v-col cols="8">
              <span class="text-subtitle-2">
                1. {{ $t("reports.generate") }}
              </span>

              <p class="text-caption">
                {{ $t("reports.hints.request") }}

                <span v-if="!isExportable" class="text-caption warn">
                  {{ $t("reports.hints.personnelnumber") }}
                </span>
              </p>
            </v-col>
            <v-col cols="4">
              <!-- if personnel number should be mandatory, add this line -->
              <!-- :disabled="(!isFirstUnlockedMonth && !exported) || !isExportable" -->
              <v-btn
                v-if="!pdf"
                :loading="loading"
                :variant="loading ? 'outlined' : 'elevated'"
                :disabled="!isFirstUnlockedMonth && !exported"
                color="primary"
                @click="request"
              >
                {{ $t("actions.request") }}
              </v-btn>

              <v-btn
                v-else
                :loading="loading"
                :variant="loading ? 'outlined' : 'elevated'"
                color="primary"
                @click="download"
              >
                {{ $t("actions.download") }}
              </v-btn>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col cols="8">
              <span class="text-subtitle-2">
                2. {{ $t("reports.lock.label") }}
              </span>

              <p class="text-caption">{{ $t("reports.hints.lock") }}</p>
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
import { parseISO } from "date-fns";
import { localizedFormat } from "@/utils/date";
import { ReportService } from "@/services/models";
import { ContractService } from "@/services/models";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { Buffer } from "buffer";
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
    disabled: {
      type: Boolean,
      default: false
    },
    exported: {
      type: Boolean,
      default: false
    },
    report: {
      type: Object,
      required: false,
      default: undefined
    },
    isExportable: {
      type: Boolean,
      default: false
    },
    isLockable: {
      type: Boolean,
      default: false
    },
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
        // TODO: Set error state in component
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
