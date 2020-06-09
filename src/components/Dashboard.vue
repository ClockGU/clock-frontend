<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <SelectContractFilter
          :contracts="contracts"
          :selected-contract="selectedContract"
        />
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
import ShiftListItem from "@/components/shifts/ShiftListItem";
import SelectContractFilter from "@/components/SelectContractFilter";

import { Contract } from "@/models/ContractModel";

import { format } from "date-fns";

import { mapGetters } from "vuex";

import { Shift } from "@/models/ShiftModel";

export default {
  name: "Dashboard",
  components: {
    ClockInOutCard,
    MonthlyProgress,
    ShiftListItem,
    SelectContractFilter
  },
  data: () => ({
    length: 3,
    step: 0,
    entity: new Contract(),
    allShiftRouter: { name: "shiftList" },
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
    lastFiveShifts() {
      return this.shifts
        .map(shift => new Shift(shift))
        .filter(shift => shift.contract === this.selectedContract.uuid)
        .slice(0, 5);
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
    this.$store.dispatch("report/list");
  }
};
</script>
