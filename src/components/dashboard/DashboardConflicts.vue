<template>
  <v-card v-if="NumberOfOverlaps === 0">
    <v-row align="center">
      <v-col cols="2" xs="2" offset="1">
        <v-icon
          :color="disabled ? 'warning' : 'success'"
          :icon="disabled ? icons.mdiHelpCircleOutline : icons.mdiCheckBold"
          :size="40"
        ></v-icon>
      </v-col>
      <v-col cols="8" xs="10">
        <div v-if="disabled">
          {{ $t("dashboard.disabled.noContract") }} <br />
          {{ $t("dashboard.disabled.problemShiftsHere") }}
        </div>
        <div v-else>
          {{ $t("dashboard.overlaps.noProblems") }}
        </div>
      </v-col>
    </v-row>
  </v-card>
  <v-card v-else>
    <v-row align="center">
      <v-col cols="2" xs="2" offset="1">
        <v-icon class="text-red" size="x-large">{{ icons.mdiAlert }}</v-icon>
      </v-col>
      <v-col cols="8" xs="10">
        {{ $tc("dashboard.overlaps.description", NumberOfOverlaps) }}
      </v-col>
    </v-row>

    <v-card-actions>
      <v-btn color="error" variant="text" block @click="dialog = true">
        {{ $t("actions.resolve") }}
      </v-btn>
    </v-card-actions>

    <v-dialog
      v-model="dialog"
      :fullscreen="smAndDown"
      max-width="1200"
      persistent
      no-click-animation
      @keydown.esc="dialog = false"
    >
      <OverlappingShiftsList
        :shifts="overlappingShifts"
        :month="month"
        @close="dialog = false"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import { mdiAlert, mdiCheckBold, mdiHelpCircleOutline } from "@mdi/js";
import { getOverlappingShifts } from "@/utils/shift";
import OverlappingShiftsList from "@/components/shifts/OverlappingShiftsList.vue";
import { mapGetters } from "vuex";
import { getFirstOfCurrentMonth } from "@/utils/date";

export default {
  name: "DashboardConflicts",
  components: { OverlappingShiftsList },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    month: {
      type: Date,
      default: getFirstOfCurrentMonth
    }
  },
  data: () => ({
    dialog: false,
    icons: {
      mdiAlert,
      mdiCheckBold,
      mdiHelpCircleOutline
    },
    touchOverlay: false
  }),
  computed: {
    ...mapGetters({
      allSelectedShifts: "contentData/selectedShifts"
    }),
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },

    // the shifts to consider for overlaps are only those that were reviewed
    overlappingShifts() {
      return this.allSelectedShifts.filter(
        (shift) => shift.wasReviewed === true
      );
    },

    NumberOfOverlaps() {
      if (this.disabled) return 0;
      const overlaps = getOverlappingShifts(this.overlappingShifts).length;
      // use 0 case for clarity - the formula will evaluate to 1 on 0 overlaps
      const result = overlaps === 0 ? 0 : 0.5 + Math.sqrt(0.25 + 2 * overlaps);
      return Math.floor(result);
    }
  }
};
</script>
