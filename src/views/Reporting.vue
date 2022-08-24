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
        <DataFilter
          :disabled="disabled"
          :date="date"
          :contract="selectedContract"
          use-locked-months
          @update="updateDate"
        >
          <template #default="{ data }">
            <MonthSwitcher :data="data" :date="date" @update="updateDate" />

            <DashboardConflicts
              :disabled="disabled"
              :shifts="data.shifts"
              :month="data.date"
            />
            <ClockCardAlert
              v-if="getAlertMessages(data.report).length !== 0"
              :messages="getAlertMessages(data.report)"
              type="error"
            ></ClockCardAlert>
            <ReportCard
              :key="data.report.uuid"
              :disabled="disabled"
              :report="data.report"
              :exported="data.isCurrentMonthLocked"
              :is-exportable="!personnelNumberMissing"
              :is-lockable="!data.isCurrentMonthLocked"
              :is-first-unlocked-month="data.firstUnlockedMonth === date"
              :shifts="data.shifts"
              @locked="refresh"
            ></ReportCard>
          </template>
        </DataFilter>
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
import DataFilter from "@/components/DataFilter";
import MonthSwitcher from "@/components/MonthSwitcher";
import DashboardConflicts from "@/components/dashboard/DashboardConflicts";
import SelectContractFilter from "@/components/SelectContractFilter";
import ReportCard from "@/components/ReportCard";
import PersonnelNumberForm from "@/components/PersonnelNumberForm.vue";
import ShiftWarnings from "@/components/shifts/ShiftWarnings";
import ClockCardAlert from "@/components/ClockCardAlert";

import { mapGetters } from "vuex";
import { mdiBadgeAccountHorizontal } from "@mdi/js";
import { localizedFormat } from "@/utils/date";

export default {
  name: "Reporting",
  components: {
    DataFilter,
    MonthSwitcher,
    DashboardConflicts,
    ReportCard,
    SelectContractFilter,
    PersonnelNumberForm,
    ShiftWarnings,
    ClockCardAlert
  },
  data: () => ({
    date: localizedFormat(new Date(), "yyyy-MM"),
    dialog: false,
    icons: { mdiBadgeAccountHorizontal },
    warnDialog: false
  }),
  computed: {
    ...mapGetters({
      contracts: "contract/contracts"
    }),
    disabled() {
      return this.$route.params.contract === undefined;
    },
    selectedContract() {
      const uuid = this.$route.params.contract;
      if (this.disabled) {
        return { uuid: null, date: { start: "2019-01-01", end: "2019-01-31" } };
      }
      return this.contracts.find((contract) => contract.uuid === uuid);
    },
    personnelNumberMissing() {
      return (
        !this.$store.state.user.personal_number &&
        this.$store.state.user.personal_number !== undefined
      );
    }
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
      let messages = [];
      const [creditHours, creditMinutes] = report.net_worktime.split(":");
      const worktimeInMinutes =
        parseInt(creditHours) * 60 + parseInt(creditMinutes);

      const [debitHours, debitMinutes] = report.debit_worktime.split(":");
      const debitInMinutes = parseInt(debitHours) * 60 + parseInt(debitMinutes);

      if ((worktimeInMinutes / debitInMinutes) * 100 > 150) {
        messages.push(this.$t("reports.warnings.maxOvertimeExceeded"));
      }
      if (((debitInMinutes - worktimeInMinutes) / debitInMinutes) * 100 > 20) {
        messages.push(this.$t("reports.warnings.insufficientWorktime"));
      }
      return messages;
    }
  }
};
</script>
