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
          <v-col cols="12">
            <DashboardWelcome />
          </v-col>

          <v-overlay v-if="contractExpired" absolute :opacity="0.97">
            <v-card max-width="400" color="error" dark>
              <v-card-title>
                {{ $t("dashboard.contractExpired.title") }}
              </v-card-title>

              <v-card-text>
                {{ $t("dashboard.contractExpired.text") }}
              </v-card-text>
            </v-card>
          </v-overlay>
          <v-col cols="12" md="6">
            <ClockInOutCard
              :clocked-shift="clockedShift"
              :selected-contract="selectedContract"
            />
          </v-col>

          <v-col cols="12" md="6">
            <DashboardShiftButton @refresh="refresh" />
          </v-col>

          <v-col cols="12" md="6">
            <MonthlyProgress :debit="debit" :credit="credit" />
          </v-col>

          <v-col cols="12" md="6">
            <DashboardConflicts :shifts="shifts" />
          </v-col>

          <v-col cols="12" md="6">
            <DashboardLastActivity />
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import ClockInOutCard from "@/components/ClockInOutCard";
import DashboardShiftButton from "@/components/DashboardShiftButton";
import MonthlyProgress from "@/components/MonthlyProgress";
import SelectContractFilter from "@/components/SelectContractFilter";
import DashboardConflicts from "@/components/DashboardConflicts";
import DashboardLastActivity from "@/components/DashboardLastActivity";
import DashboardWelcome from "@/components/DashboardWelcome";

import { Contract } from "@/models/ContractModel";

import { mapGetters } from "vuex";

import contractExpiredMixin from "@/mixins/contractExpired";

import { log } from "@/utils/log";
import { minutesToHHMM } from "@/utils/time";

export default {
  name: "Dashboard",
  metaInfo: {
    title: "Dashboard"
  },
  components: {
    ClockInOutCard,
    DashboardShiftButton,
    MonthlyProgress,
    SelectContractFilter,
    DashboardConflicts,
    DashboardLastActivity,
    DashboardWelcome
  },
  mixins: [contractExpiredMixin],
  data: () => ({
    length: 3,
    step: 0,
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

      return this.contracts.find(contract => contract.uuid === uuid);
    },
    latestReport() {
      const reports = this.reports
        .filter(report => report.contract === this.selectedContract.uuid)
        .sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

      return reports.pop();
    },
    debit() {
      return minutesToHHMM(this.selectedContract.minutes);
    },
    credit() {
      if (this.reports.length < 1) return "00:00";

      let creditHours = String(Math.floor(this.latestReport.duration / 60));
      let creditMinutes = String(
        Math.abs(Math.floor(this.latestReport.duration % 60))
      );

      if (creditHours.length < 2) {
        creditHours = "0" + creditHours;
      }

      if (creditMinutes.length < 2) {
        creditMinutes = "0" + creditMinutes;
      }

      return `${creditHours}:${creditMinutes}`;
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
    }
  }
};
</script>
