<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <SelectContractFilter :disabled="disabled" />
      </v-col>

      <v-card min-width="100%" :elevation="0">
        <v-row class="mx-0">
          <v-col cols="12" order="-10">
            <DashboardWelcome />
          </v-col>

          <v-col cols="12" md="6" order="0" order-md="0">
            <ClockInOutCard
              :disabled="disabled"
              :clocked-shift="clockedShift"
            />
          </v-col>

          <v-col cols="12" md="6" order="1" order-md="1">
            <DashboardMessageList />
          </v-col>

          <v-col cols="12" md="6" order="2">
            <DashboardShiftButton :disabled="disabled" @refresh="refresh" />
          </v-col>

          <v-col cols="12" md="6" order="3">
            <DashboardProgress
              :disabled="disabled"
              :azk-data="azkData"
              :weekly-data="weeklyData"
              :daily-data="dailyData"
            />
          </v-col>

          <v-col cols="12" md="6" order="4">
            <DashboardConflicts :shifts="selectedShifts" :disabled="disabled" />
          </v-col>

          <v-col cols="12" md="6" order="5">
            <DashboardLastActivity :disabled="disabled" @refresh="refresh" />
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { localizedFormat } from "@/utils/date";

import SelectContractFilter from "@/components/SelectContractFilter";
import ClockInOutCard from "@/components/ClockInOutCard";
import DashboardShiftButton from "@/components/dashboard/DashboardShiftButton";
import DashboardMessageList from "@/components/dashboard/DashboardMessageList";
import DashboardProgress from "@/components/dashboard/DashboardProgress";
import DashboardConflicts from "@/components/dashboard/DashboardConflicts";
import DashboardLastActivity from "@/components/dashboard/DashboardLastActivity";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import { isSameDay, isSameWeek, isBefore, differenceInMinutes } from "date-fns";
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
    DashboardMessageList,
    DashboardProgress,
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
      selectedContract: "selectedContract/selectedContract",
      selectedReports: "contentData/selectedReports",
      selectedShifts: "contentData/selectedShifts"
    }),
    disabled() {
      return this.selectedContract === undefined;
    },
    latestReport() {
      return this.selectedReports.at(-1);
    },
    azkData() {
      //reminder: the Progress component expects the carryover to be the last item
      //any changes made here must be adapted in Progress.vue
      if (this.disabled) {
        return [
          {
            name: this.$t("reports.carryoverLast"),
            value: "HH:MM"
          },
          {
            name: this.$t("reports.debit"),
            value: "HH:MM"
          },
          {
            name: this.$t("reports.timeWorked"),
            value: "HH:MM"
          },
          {
            name: this.$t("reports.carryoverNext"),
            value: "HH:MM"
          }
        ];
      }
      return [
        {
          name: this.$t("reports.carryoverLast"),
          value: this.latestReport.carryOverPreviousMonth
        },
        {
          name: this.$t("reports.debit"),
          value: this.latestReport.debitWorktime
        },
        {
          name: this.$t("reports.timeWorked"),
          value: this.latestReport.worktime
        },
        {
          name: this.$t("reports.carryoverNext"),
          value: this.latestReport.carryover
        }
      ];
    },
    weeklyData() {
      if (this.disabled) {
        return {
          worktime: 0,
          avg: 0
        };
      }
      let duration = 0;
      this.selectedShifts
        .filter(
          (shift) =>
            this.thisWeek(shift.started) &&
            isBefore(shift.stopped, new Date()) &&
            shift.wasReviewed
        )
        .forEach((shift) => {
          duration += differenceInMinutes(shift.stopped, shift.started);
        });
      //differenceInMinutes(this.shifts[0].date.start, this.shifts[0].date.end);
      return {
        worktime: duration,
        avg: this.selectedContract.minutes / 4
      };
    },
    dailyData() {
      let duration = 0;
      this.selectedShifts
        .filter(
          (shift) =>
            this.today(shift.started) &&
            isBefore(shift.stopped, new Date()) &&
            shift.wasReviewed
        )
        .forEach((shift) => {
          duration += differenceInMinutes(shift.stopped, shift.started);
        });
      return duration;
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
      return isSameDay(today, date);
    },
    thisWeek(date) {
      const thisWeek = new Date();
      return isSameWeek(thisWeek, date, { weekStartsOn: 1 });
    }
  }
};
</script>
