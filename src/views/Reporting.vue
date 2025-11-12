<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-alert
          v-if="personnelNumberMissing"
          :icon="icons.mdiBadgeAccountHorizontal"
          prominent
          type="warning"
        >
          <v-row align="center">
            <v-col class="flex-grow-1 flex-shrink-0">
              {{ $t("reports.personnelNumberMissing") }}
            </v-col>
            <v-col class="flex-grow-0 flex-shrink-1">
              <v-btn color="white" variant="outlined" @click="openDialog">
                {{ $t("buttons.newEntity", [$tc("personnelNumber.label")]) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
      <v-col cols="12">
        <SelectContractFilter
          :disabled="disabled"
          :contracts="contracts"
          :selected-contract="selectedContract"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center" cols="12">
        <TimeIntervalSwitcher
          v-model="date"
          :disabled="disabled"
          :allowed-date-fn="monthValidateFn"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <DashboardConflicts
          :disabled="disabled"
          :shifts="selectedShifts"
          :month="date"
          class="mb-4"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ClockCardAlert
          v-if="getAlertMessages(report).length !== 0"
          :messages="getAlertMessages(report)"
          type="error"
        ></ClockCardAlert>
      </v-col>
    </v-row>
    <v-card min-width="100%" :elevation="0">
      <v-container>
        <v-row>
          <v-col cols="12" :md="isStudEmp ? 6 : 12" order="0">
            <ReportCard
              :key="report.id"
              :disabled="disabled"
              :report="report"
              :exported="isCurrentMonthLocked"
              :is-exportable="!personnelNumberMissing"
              :is-lockable="!isCurrentMonthLocked"
              :is-first-unlocked-month="isFirstUnlockedMonth"
            ></ReportCard>
          </v-col>
          <v-col v-if="isStudEmp" cols="12" md="6" order="1">
            <VacationCard :disabled="disabled" :report="report"></VacationCard>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-dialog
      v-if="dialog"
      v-model="dialog"
      :max-width="900"
      @click:outside="closeDialog"
      ><PersonnelNumberForm dialog @close="closeDialog"
    /></v-dialog>
    <ShiftWarnings
      v-if="warnDialog"
      :warnings="warnings"
      @close="dialog = false"
    ></ShiftWarnings>
  </v-container>
</template>

<script>
import DashboardConflicts from "@/components/dashboard/DashboardConflicts.vue";
import SelectContractFilter from "@/components/SelectContractFilter.vue";
import ReportCard from "@/components/ReportCard.vue";
import PersonnelNumberForm from "@/components/settings/PersonnelNumberForm.vue";
import ShiftWarnings from "@/components/shifts/ShiftWarnings.vue";
import ClockCardAlert from "@/components/ClockCardAlert.vue";

import { v4 as uuidv4 } from "uuid";
import { mapGetters } from "vuex";
import { mdiBadgeAccountHorizontal } from "@mdi/js";
import { firstOfCurrentMonth, localizedFormat } from "@/utils/date";
import { addMonths, isSameDay, isSameMonth } from "date-fns";
import TimeIntervalSwitcher from "@/components/TimeIntervalSwitcher.vue";
import VacationCard from "@/components/VacationCard.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Reporting",
  components: {
    VacationCard,
    TimeIntervalSwitcher,
    DashboardConflicts,
    ReportCard,
    SelectContractFilter,
    PersonnelNumberForm,
    ShiftWarnings,
    ClockCardAlert
  },
  data: () => ({
    date: firstOfCurrentMonth,
    dialog: false,
    icons: { mdiBadgeAccountHorizontal },
    warnDialog: false,
    report: { id: uuidv4() }
  }),
  computed: {
    ...mapGetters({
      contracts: "contentData/allContracts",
      selectedContract: "selectedContract/selectedContract",
      selectedReports: "contentData/selectedReports",
      selectedShifts: "contentData/selectedShifts"
    }),
    isStudEmp() {
      if (this.selectedContract === undefined) {
        return true;
      }
      return this.selectedContract.worktimeModelName === "studEmp";
    },
    disabled() {
      return this.selectedContract === undefined || this.report === undefined;
    },
    personnelNumberMissing() {
      return (
        !this.$store.state.user.personal_number &&
        this.$store.state.user.personal_number !== undefined
      );
    },
    isCurrentMonthLocked() {
      if (this.disabled) return false;
      const lockedShifts = this.selectedShifts.filter(
        (shift) => isSameMonth(shift.started, this.date) && shift.locked
      );
      return lockedShifts.length > 0;
    },
    lockedMonths() {
      let months = [];
      if (this.disabled) return months;
      this.selectedReports.map((report) => {
        const lockedShifts = this.selectedShifts.filter((shift) => {
          return isSameMonth(report.monthYear, shift.started) && shift.locked;
        });
        if (lockedShifts.length > 0) {
          months.push(report.monthYear);
        }
      });
      return months;
    },
    isFirstUnlockedMonth() {
      if (this.disabled) return false;
      if (this.lockedMonths.length === 0) {
        return isSameMonth(this.date, this.selectedReports[0].monthYear);
      }
      return isSameMonth(
        addMonths(this.lockedMonths[this.lockedMonths.length - 1], 1),
        this.date
      );
    },
    monthValidateFn() {
      return (value) => {
        return this.selectedReports
          .map((report) => localizedFormat(report.monthYear, "yyyy-MM"))
          .includes(value);
      };
    }
  },
  watch: {
    selectedContract() {
      // This watcher is yet a dirty hack. By updating the date re-run the code
      // determining the correct report.
      // TODO: Refactor both watchers into a reactive patern
      this.updateDate(
        this.selectedReports[this.selectedReports.length - 1].monthYear
      );
    }
  },

  mounted() {
    // Add watcher for the case that the selected Contract has no Report for the current month.
    // In this case set the date to the date of the last Report existing.
    this.$watch(
      "date",
      (value) => {
        if (this.selectedReports === undefined) return;
        const filteredReports = this.selectedReports.filter((report) =>
          isSameDay(report.monthYear, value)
        );
        let report = filteredReports[0];
        if (report === undefined) {
          this.date =
            this.selectedReports[this.selectedReports.length - 1].monthYear;
          return;
        }
        this.report = report;
      },
      { immediate: true }
    );
  },
  methods: {
    updateDate(value) {
      this.date = value;
    },
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async refresh() {
      const selectedMonth = this.date;

      await Promise.all([
        this.$store.dispatch("shift/queryShifts"),
        this.$store.dispatch("contract/queryContracts"),
        this.$store.dispatch("report/list")
      ]);

      this.updateDate(selectedMonth);
    },
    getAlertMessages(report) {
      if (this.disabled) return [];
      let messages = [];
      const worktimeInMinutes = report.worktimeInMinutes;
      const debitInMinutes = report.debitWorktimeInMinutes;

      if ((worktimeInMinutes / debitInMinutes) * 100 > 150) {
        messages.push(this.$t("reports.warnings.maxOvertimeExceeded"));
      }
      if (((debitInMinutes - worktimeInMinutes) / debitInMinutes) * 100 > 20) {
        messages.push(this.$t("reports.warnings.insufficientWorktime"));
      }
      if (worktimeInMinutes > 80 * 60) {
        messages.push(this.$t("reports.warnings.worktimeOverEightyHours"));
      }
      return messages;
    }
  }
};
</script>
