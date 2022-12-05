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
            <v-col class="grow">
              {{ $t("reports.personnelNumberMissing") }}
            </v-col>
            <v-col class="shrink">
              <v-btn color="white" outlined @click="openDialog">
                {{
                  $t("buttons.newEntity", {
                    entity: $tc("personnelNumber.label")
                  })
                }}
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

      <v-col>
        <MonthSwitcher
          :disabled="disabled"
          :date="date"
          :allowed-date-fn="monthValidateFn"
          @update="updateDate"
        />

        <DashboardConflicts
          :disabled="disabled"
          :shifts="selectedShifts"
          :month="date"
        />
        <ClockCardAlert
          v-if="getAlertMessages(report).length !== 0"
          :messages="getAlertMessages(report)"
          type="error"
        ></ClockCardAlert>
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
    </v-row>
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
import MonthSwitcher from "@/components/MonthSwitcher";
import DashboardConflicts from "@/components/dashboard/DashboardConflicts";
import SelectContractFilter from "@/components/SelectContractFilter";
import ReportCard from "@/components/ReportCard";
import PersonnelNumberForm from "@/components/PersonnelNumberForm.vue";
import ShiftWarnings from "@/components/shifts/ShiftWarnings";
import ClockCardAlert from "@/components/ClockCardAlert";

import { v4 as uuidv4 } from "uuid";
import { mapGetters } from "vuex";
import { mdiBadgeAccountHorizontal } from "@mdi/js";
import { firstOfMonth, localizedFormat } from "@/utils/date";
import { isSameDay, isSameMonth } from "date-fns";

export default {
  name: "Reporting",
  components: {
    MonthSwitcher,
    DashboardConflicts,
    ReportCard,
    SelectContractFilter,
    PersonnelNumberForm,
    ShiftWarnings,
    ClockCardAlert
  },
  data: () => ({
    date: firstOfMonth,
    dialog: false,
    icons: { mdiBadgeAccountHorizontal },
    warnDialog: false
  }),
  computed: {
    ...mapGetters({
      contracts: "contentData/allContracts",
      selectedContract: "selectedContract/selectedContract",
      selectedReports: "contentData/selectedReports",
      selectedShifts: "contentData/selectedShifts"
    }),
    disabled() {
      return this.selectedContract === undefined;
    },
    personnelNumberMissing() {
      return (
        !this.$store.state.user.personal_number &&
        this.$store.state.user.personal_number !== undefined
      );
    },
    report() {
      if (this.disabled) return { id: uuidv4() };
      return this.selectedReports.filter((report) =>
        isSameDay(report.monthYear, this.date)
      )[0];
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
        if (lockedShifts > 0) {
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
        this.lockedMonths[this.lockedMonths.length - 1],
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
  // async updated() {
  //   const shifts = this.selectedShifts.filter((shift) =>
  //     isSameMonth(this.report.monthYear, shift.started)
  //   );
  //   console.log(JSON.stringify(shifts, null, 4));
  // },
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
