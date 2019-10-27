<template>
  <v-card>
    <v-card-title class="justify-center">Monthly progress</v-card-title>

    <v-card-text class="text-center">
      <v-progress-circular
        :rotate="-90"
        :size="200"
        :width="20"
        :value="progress"
        color="teal"
      >
        {{ totalWorktime }} / {{ contract.hours | hoursToWorktime }}
      </v-progress-circular>
    </v-card-text>
  </v-card>
</template>

<script>
import { Shift } from "@/models/ShiftModel";
import { minutesToHHMM } from "@/utils/time";
import { mapGetters } from "vuex";

export default {
  name: "DashboardMonthlyProgress",
  filters: {
    hoursToWorktime(value) {
      const hours = Math.floor(value);
      const minutes = parseInt((60 * (value - hours)).toFixed(0));

      return `${hours.pad(2)}:${minutes.pad(2)}`;
    }
  },
  computed: {
    ...mapGetters({
      currentShifts: "shift/shiftsCurrentMonth",
      contract: "selectedContract"
    }),
    progress() {
      return (100 * this.totalMinutes) / (this.contract.hours * 60);
    },
    currentDurations() {
      const shifts = this.currentShifts.map(shift => new Shift(shift));

      return shifts.map(shift => shift.duration);
    },
    totalMinutes() {
      return this.currentDurations.reduce((acc, cur) => acc + cur, 0);
    },
    totalWorktime() {
      return minutesToHHMM(this.totalMinutes);
    }
  }
};
</script>
