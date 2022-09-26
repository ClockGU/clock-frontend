<template>
  <v-card>
    <v-card-title>
      {{ $t("dashboard.lastActivity") }}
    </v-card-title>
    <v-card-text>
      <template v-if="lastShifts.length > 0">
        <v-list>
          <template v-for="shift in lastShifts">
            <ShiftListItem :key="shift.id" :editable="true" :item="shift" />
          </template>
        </v-list>
        <v-btn color="success" text :to="allShiftRouter">
          {{ $t("dashboard.showAll") }}
        </v-btn>
      </template>
      <v-container v-else>
        {{
          disabled
            ? $t("dashboard.disabled.noContract")
            : $t("dashboard.emptyActivity")
        }}
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import ShiftListItem from "@/components/shifts/ShiftListItem";
import { isBefore } from "date-fns";

import { mapGetters } from "vuex";

export default {
  name: "DashboardLastActivity",
  components: { ShiftListItem },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    allShiftRouter: { name: "shiftList" }
  }),
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract/selectedContract",
      shifts: "contentData/selectedShifts"
    }),
    lastShifts() {
      if (this.disabled) return [];
      return this.shifts
        .filter((shift) => isBefore(shift.started, new Date()))
        .sort((a, b) => {
          return new Date(b.stopped) - new Date(a.started);
        })
        .slice(0, 5);
    }
  }
};
</script>
