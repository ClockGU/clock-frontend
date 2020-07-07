<template>
  <v-card>
    <v-card-title>
      {{ $t("dashboard.lastActivity") }}
    </v-card-title>
    <v-card-text>
      <template v-if="lastShifts.length > 0">
        <v-list>
          <v-list-item-group>
            <template v-for="shift in lastShifts">
              <ShiftListItem
                :key="shift.uuid"
                :editable="false"
                :item="shift"
              />
            </template>
          </v-list-item-group>
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
        .map(shift => new Shift(shift))
        .filter(shift => shift.contract === this.selectedContract.uuid)
        .sort((a, b) => {
          return new Date(b.date.end) - new Date(a.date.end);
        })
        .slice(0, 5);
    },
    selectedContract() {
      const uuid = this.$route.params.contract;

      return this.contracts.find(contract => contract.uuid === uuid);
    }
  }
};
</script>
