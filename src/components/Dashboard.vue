<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <SelectContractFilter
          :contracts="contracts"
          :selected-contract="selectedContract"
        />
      </v-col>

      <v-card min-width="100%" :elevation="0">
        <v-row class="mx-0">
          <v-col cols="12" order="-10">
            <DashboardWelcome />
          </v-col>

          <v-col cols="12" md="6" order="0" order-md="0">
            <ClockInOutCard
              :clocked-shift="clockedShift"
              :selected-contract="selectedContract"
            />
          </v-col>

          <v-col cols="12" md="6" order="1" order-md="1">
            <DashboardMessageList />
          </v-col>

          <v-col cols="12" md="6" order="2">
            <DashboardShiftButton @refresh="refresh" />
          </v-col>

          <v-col cols="12" md="6" order="3">
            <Progress
              :azk-data="azkData"
              :weekly-data="weeklyData"
              :daily-data="dailyData"
            />
          </v-col>

          <v-col cols="12" md="6" order="4">
            <DataFilter :date="date" :contract="selectedContract">
              <template #default="{ data }">
                <DashboardConflicts :shifts="data.shifts" />
              </template>
            </DataFilter>
          </v-col>

          <v-col cols="12" md="6" order="5">
            <DashboardLastActivity @refresh="refresh" />
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { localizedFormat } from "@/utils/date";

import ClockInOutCard from "@/components/ClockInOutCard";
import DashboardShiftButton from "@/components/DashboardShiftButton";
import DashboardMessageList from "@/components/DashboardMessageList";
import Progress from "@/components/Progress";
import SelectContractFilter from "@/components/SelectContractFilter";
import DashboardConflicts from "@/components/DashboardConflicts";
import DashboardLastActivity from "@/components/DashboardLastActivity";
import DashboardWelcome from "@/components/DashboardWelcome";
import DataFilter from "@/components/DataFilter";
import {
  isSameDay,
  isSameWeek,
  isBefore,
  parseISO,
  differenceInMinutes
} from "date-fns";
import { Contract } from "@/models/ContractModel";

import { mapGetters } from "vuex";

import { log } from "@/utils/log";

export default {
  name: "Dashboard",
  metaInfo: {
    title: "Dashboard"
  },
  components: {
    ClockInOutCard,
    DashboardShiftButton,
    DataFilter,
    DashboardMessageList,
    Progress,
    SelectContractFilter,
    DashboardConflicts,
    DashboardLastActivity,
    DashboardWelcome
  },
  data: () => ({
    date: localizedFormat(new Date(), "yyyy-MM"),
    entity: new Contract(),
    loading: true
  }),
  computed: {
    ...mapGetters({
      clockedShift: "clock/clockedShift",
      contracts: "contract/contracts",
      shifts: "shift/shifts",
      reports: "report/reports"
    }),
    selectedContract() {
      const uuid = this.$route.params.contract;
      return this.contracts.find((contract) => contract.uuid === uuid);
    },
    latestReport() {
      const reports = this.reports
        .filter((report) => report.contract === this.selectedContract.uuid)
        .sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

      return reports.pop();
    },
    azkData() {
      //reminder: the Progress component expects the carryover to be the last item
      //any changes made here must be adapted in Progress.vue
      return [
        {
          name: this.$t("reports.carryoverLast"),
          value: this.latestReport.carryover.prev
        },
        {
          name: this.$t("reports.debit"),
          value: this.latestReport.debit_worktime
        },
        {
          name: this.$t("reports.timeWorked"),
          value: this.latestReport.net_worktime
        },
        {
          name: this.$t("reports.carryoverNext"),
          value: this.latestReport.carryover.next
        }
      ];
    },
    weeklyData() {
      let duration = 0;
      this.shifts
        .filter(
          (shift) =>
            shift.contract === this.selectedContract.uuid &&
            this.thisWeek(shift.date) &&
            isBefore(parseISO(shift.date.end), new Date()) &&
            shift.reviewed
        )
        .forEach((shift) => {
          duration += differenceInMinutes(
            parseISO(shift.date.end),
            parseISO(shift.date.start)
          );
        });
      //differenceInMinutes(this.shifts[0].date.start, this.shifts[0].date.end);
      return {
        worktime: duration,
        avg: this.selectedContract.worktime / 4
      };
    },
    dailyData() {
      let duration = 0;
      this.shifts
        .filter(
          (shift) =>
            shift.contract === this.selectedContract.uuid &&
            this.today(shift.date) &&
            isBefore(parseISO(shift.date.end), new Date()) &&
            shift.reviewed
        )
        .forEach((shift) => {
          duration += differenceInMinutes(
            parseISO(shift.date.end),
            parseISO(shift.date.start)
          );
        });
      return duration;
    },
    unreviewedShiftsToday() {
      // TODO: display unreviewed shifts somewhere on the Dashboard
      return this.shifts.filter(
        (shift) =>
          shift.contract === this.selectedContract.uuid &&
          this.today(shift.date) &&
          isBefore(parseISO(shift.date.end), new Date()) &&
          !shift.reviewed
      ).length;
    }
  },
  methods: {
    async refresh() {
      try {
        await Promise.all([
          this.$store.dispatch("shift/queryShifts"),
          this.$store.dispatch("contract/queryContracts"),
          this.$store.dispatch("report/list")
        ]);
      } catch (error) {
        log(error);
      }
    },
    today(date) {
      const today = new Date();
      return isSameDay(today, parseISO(date.start));
    },
    thisWeek(date) {
      const thisWeek = new Date();
      return isSameWeek(thisWeek, parseISO(date.start), { weekStartsOn: 1 });
    }
  }
};
</script>
