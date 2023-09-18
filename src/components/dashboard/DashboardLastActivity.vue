<template>
  <v-card>
    <v-card-title>
      {{ $t("dashboard.lastActivity") }}
    </v-card-title>
    <v-card-text>
      <div v-if="lastShifts.length > 0">
        <v-list>
          <ShiftFormDialog
            v-for="shift in lastShifts"
            :key="shift.id"
            :shift="shift"
            disable-activator
          >
            <template #activator="{ on }">
              <ShiftListItem :editable="true" :shift="shift" v-on="on" />
            </template>
          </ShiftFormDialog>
        </v-list>
        <v-btn color="success" variant="text" :to="allShiftRouter">
          {{ $t("dashboard.showAll") }}
        </v-btn>
      </div>
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
import ShiftListItem from "@/components/shifts/ShiftListItem.vue";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import { isBefore } from "date-fns";

import { mapGetters } from "vuex";

export default {
  name: "DashboardLastActivity",
  components: { ShiftListItem, ShiftFormDialog },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    allShiftRouter: { name: "shiftList" },
    dialog: false
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
