<template>
  <div v-if="initialLoad"></div>
  <OnboardDialog v-else-if="showOnboardingDialog" @close="finishOnboarding" />
  <v-container v-else>
    <v-row>
      <v-col cols="12">
        <v-select
          v-model="selectedContract"
          :items="contracts"
          :prepend-icon="icons.mdiFileDocumentEditOutline"
          :label="contractLabel"
          hint="Change the contract to see different data"
          item-text="name"
          item-value="uuid"
          persistent-hint
          solo
          return-object
        ></v-select>
      </v-col>

      <v-col cols="12" md="6">
        <ClockInOutCard
          :clocked-shift="clockedShift"
          :selected-contract="selectedContract"
        />
      </v-col>

      <v-col>
        <MonthlyProgress :debit="debit" :credit="credit" />
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Last five shifts</v-card-title>
          <v-card-text>
            <template v-if="lastFiveShifts.length > 0">
              <v-list>
                <v-list-item-group>
                  <template v-for="shift in lastFiveShifts">
                    <ShiftListItem
                      :key="shift.uuid"
                      :editable="false"
                      :item="shift"
                    />
                  </template>
                </v-list-item-group>
              </v-list>
              <v-btn color="success" text :to="allShiftRouter">View all</v-btn>
            </template>
            <v-container v-else>
              You have not clocked any shfits in this contract.
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ClockInOutCard from "@/components/ClockInOutCard";
import MonthlyProgress from "@/components/MonthlyProgress";
import OnboardDialog from "@/components/OnboardDialog";
import ShiftListItem from "@/components/shifts/ShiftListItem";

import { Contract } from "@/models/ContractModel";
import { mdiRecord } from "@mdi/js";

import { format } from "date-fns";

import { mapGetters } from "vuex";

import { Shift } from "@/models/ShiftModel";

export default {
  name: "Dashboard",
  components: { ClockInOutCard, OnboardDialog, MonthlyProgress, ShiftListItem },
  data: () => ({
    length: 3,
    step: 0,
    icons: { mdiRecord },
    entity: new Contract(),
    showOnboardingDialog: false,
    initialLoad: true,
    selectedContract: null,
    allShiftRouter: { name: "shiftList" }
  }),
  computed: {
    ...mapGetters({
      clockedShift: "clock/clockedShift",
      contracts: "contract/contracts",
      shifts: "shift/shifts",
      reports: "report/reports"
    }),
    lastFiveShifts() {
      return this.shifts
        .map(shift => new Shift(shift))
        .filter(shift => shift.contract === this.selectedContract.uuid)
        .slice(0, 5);
    },
    contractLabel() {
      return this.selectedContract !== null
        ? "Selected Contract"
        : "Select a contract";
    },
    latestReport() {
      const thisMonth = format(new Date(), "yyyy-MM") + "-01";
      return this.reports.find(
        report =>
          report.date === thisMonth &&
          report.contract === this.selectedContract.uuid
      );
    },
    debit() {
      return `${this.selectedContract.hours}:00`;
    },
    credit() {
      if (this.reports.length < 1) return "00:00";

      let creditHours = String(Math.floor(this.latestReport.duration / 60));
      let creditMinutes = String(Math.floor(this.latestReport.duration % 60));

      if (creditHours.length < 2) {
        creditHours = "0" + creditHours;
      }

      if (creditMinutes.length < 2) {
        creditMinutes = "0" + creditMinutes;
      }

      return `${creditHours}:${creditMinutes}`;
    }
  },
  created() {
    this.load();
  },
  methods: {
    async finishOnboarding() {
      await this.load();
      this.showOnboardingDialog = false;
    },
    async load() {
      await this.$store.dispatch("contract/queryContracts");
      await this.$store.dispatch("shift/queryShifts");
      await this.$store.dispatch("report/list");

      if (this.contracts.length === 0) {
        this.showOnboardingDialog = true;
      } else {
        this.selectedContract = this.contracts[0];
      }

      this.initialLoad = false;

      return Promise.resolve();
    }
  }
};
</script>
