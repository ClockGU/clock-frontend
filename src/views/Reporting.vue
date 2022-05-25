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
          :contracts="contracts"
          :selected-contract="selectedContract"
        />
      </v-col>

      <v-col>
        <DataFilter
          :date="date"
          :contract="selectedContract"
          use-locked-months
          @update="updateDate"
        >
          <template #default="{ data }">
            <MonthSwitcher :data="data" :date="date" @update="updateDate" />

            <DashboardConflicts :shifts="data.shifts" :month="data.date" />

            <ReportCard
              :key="data.report.uuid"
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
  </v-container>
</template>

<script>
import DataFilter from "@/components/DataFilter";
import MonthSwitcher from "@/components/MonthSwitcher";
import DashboardConflicts from "@/components/dashboard/DashboardConflicts";
import SelectContractFilter from "@/components/SelectContractFilter";
import ReportCard from "@/components/ReportCard";
import PersonnelNumberForm from "@/components/PersonnelNumberForm.vue";
import { mapGetters } from "vuex";
import { mdiBadgeAccountHorizontal } from "@mdi/js";

export default {
  name: "Reporting",
  components: {
    DataFilter,
    MonthSwitcher,
    DashboardConflicts,
    ReportCard,
    SelectContractFilter,
    PersonnelNumberForm
  },
  data: () => ({
    date: "2020-07",
    dialog: false,
    icons: { mdiBadgeAccountHorizontal }
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
    }
  }
};
</script>
