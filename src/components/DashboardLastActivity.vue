<template>
  <v-card>
    <v-card-title>
      {{ $t("dashboard.lastActivity") }}
    </v-card-title>
    <v-card-text>
      <template v-if="lastShifts.length > 0">
        <v-list>
          <template v-for="shift in lastShifts">
            <ShiftListItem
              :key="shift.uuid"
              :editable="true"
              :item="shift"
              @refresh="$emit('refresh')"
            />
          </template>
        </v-list>
        <v-btn color="success" text :to="allShiftRouter">
          {{ $t("dashboard.showAll") }}
        </v-btn>
      </template>
      <v-container v-else>
        {{ $t("dashboard.emptyActivity") }}
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import ShiftListItem from "@/components/shifts/ShiftListItem";
import { Shift } from "@/models/ShiftModel";
import { isBefore } from "date-fns";

import { mapGetters } from "vuex";

export default {
  name: "DashboardLastActivity",
  components: { ShiftListItem },
  data: () => ({
    allShiftRouter: { name: "shiftList" }
  }),
  computed: {
    ...mapGetters({
      contracts: "contract/contracts",
      shifts: "shift/shifts"
    }),
    lastShifts() {
      return this.shifts
        .map((shift) => new Shift(shift))
        .filter(
          (shift) =>
            shift.contract === this.selectedContract.uuid &&
            isBefore(shift.end, new Date())
        )
        .sort((a, b) => {
          return new Date(b.date.end) - new Date(a.date.end);
        })
        .slice(0, 5);
    },
    selectedContract() {
      const uuid = this.$route.params.contract;

      return this.contracts.find((contract) => contract.uuid === uuid);
    }
  }
};
</script>
