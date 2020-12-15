<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-alert v-if="personnelNumberMissing" type="warning">
          {{ $t("reports.personnelNumberMissing") }}
        </v-alert>
      </v-col>
      <v-col cols="12">
        <SelectContractFilter
          :contracts="contracts"
          :selected-contract="selectedContract"
        />
      </v-col>

      <v-col>
        <DataFilter
          :date="date"
          :contract="selectedContract"
          @update="updateDate"
        >
          <template #default="{ data }">
            <MonthSwitcher :data="data" :date="date" @update="updateDate" />

            <DashboardConflicts :shifts="data.shifts" :month="data.date" />

            <ReportCard
              :key="data.report.uuid"
              :report="data.report"
              :exported="data.isCurrentMonthLocked"
              :is-lockable="!data.isCurrentMonthLocked"
              :is-first-unlocked-month="data.firstUnlockedMonth === date"
              :shifts="data.shifts"
              @locked="refresh"
            ></ReportCard>
          </template>
        </DataFilter>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DataFilter from "@/components/DataFilter";
import MonthSwitcher from "@/components/MonthSwitcher";
import DashboardConflicts from "@/components/DashboardConflicts";
import SelectContractFilter from "@/components/SelectContractFilter";
import ReportCard from "@/components/ReportCard";
import { mapGetters } from "vuex";

export default {
  name: "Reporting",
  components: {
    DataFilter,
    MonthSwitcher,
    DashboardConflicts,
    ReportCard,
    SelectContractFilter
  },
  data: () => ({
    date: "2020-07"
  }),
  computed: {
    ...mapGetters({
      contracts: "contract/contracts"
    }),
    selectedContract() {
      const uuid = this.$route.params.contract;

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
    async refresh() {
      await Promise.all([
        this.$store.dispatch("shift/queryShifts"),
        this.$store.dispatch("contract/queryContracts"),
        this.$store.dispatch("report/list")
      ]);
    }
  }
};
</script>
