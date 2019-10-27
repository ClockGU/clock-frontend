<template>
  <v-row>
    <v-col cols="12" xs="12" sm="6">
      <ContractListCardSelect :contract="contract" />
    </v-col>

    <v-col cols="12" xs="12" sm="6">
      <DashboardMonthlyProgress />
    </v-col>

    <v-col cols="12" xs="12" md="6">
      <v-sparkline
        fill
        :gradient="gradient"
        :padding="padding"
        :smooth="radius || false"
        :value="value"
        auto-draw
      ></v-sparkline>
    </v-col>

    <v-col xs="12">
      <DashboardLastShift />
    </v-col>
  </v-row>
</template>

<script>
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"]
];

import ContractListCardSelect from "@/components/contracts/ContractListCardSelect";
import DashboardLastShift from "@/components/DashboardLastShifts";
import DashboardMonthlyProgress from "@/components/DashboardMonthlyProgress";

import { mapGetters } from "vuex";

export default {
  name: "ViewDashboard",
  components: {
    ContractListCardSelect,
    DashboardLastShift,
    DashboardMonthlyProgress
  },
  data() {
    return {
      gradient: gradients[5],
      gradients,
      padding: 8,
      radius: 10,
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]
    };
  },
  computed: {
    ...mapGetters({
      shifts: "shift/shifts",
      contract: "selectedContract"
    })
  }
};
</script>
