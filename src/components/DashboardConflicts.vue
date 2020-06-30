<template>
  <v-card
    v-if="overlappingShifts.length < 1"
    color="success"
    class="white--text"
  >
    <v-row align="center">
      <v-col cols="2" xs="2" offset="1">
        <v-icon x-large>{{ icons.mdiCheckBold }}</v-icon>
      </v-col>
      <v-col cols="8" xs="10">
        {{ $t("dashboard.overlaps.noProblems") }}
      </v-col>
    </v-row>
  </v-card>

  <v-card v-else>
    <v-card-title>
      {{ $t("dashboard.overlaps.nProblems") }}
    </v-card-title>

    <v-card-text>
      {{
        $tc("dashboard.overlaps.description", overlappingShifts.length, {
          n: overlappingShifts.length
        })
      }}
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" text :to="{ name: 'shiftList' }">
        {{ $t("actions.resolve") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mdiCheckBold } from "@mdi/js";
import { getOverlappingShifts } from "@/utils/shift";

export default {
  name: "DashboardConflicts",
  props: {
    shifts: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    icons: {
      mdiCheckBold
    }
  }),
  computed: {
    overlappingShifts() {
      return getOverlappingShifts(this.shifts);
    }
  }
};
</script>
