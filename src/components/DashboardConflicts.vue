<template>
  <v-card v-if="overlappingShifts.length < 1">
    <v-row align="center">
      <v-col cols="2" xs="2" offset="1">
        <v-icon class="green--text" x-large>{{ icons.mdiCheckBold }}</v-icon>
      </v-col>
      <v-col cols="8" xs="10">
        {{ $t("dashboard.overlaps.noProblems") }}
      </v-col>
    </v-row>
  </v-card>

  <v-card v-else>
    <v-row align="center">
      <v-col cols="2" xs="2" offset="1">
        <v-icon class="red--text" x-large>{{ icons.mdiAlert }}</v-icon>
      </v-col>
      <v-col cols="8" xs="10">
        {{
          $tc("dashboard.overlaps.description", overlappingShifts.length, {
            n: overlappingShifts.length
          })
        }}
      </v-col>
    </v-row>

    <v-card-actions>
      <v-btn color="error" text block @click="dialog = true">
        {{ $t("actions.resolve") }}
      </v-btn>
    </v-card-actions>

    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="1200"
      persistent
      no-click-animation
      @keydown.esc="dialog = false"
    >
      <CalendarOverlap
        :shifts="shifts"
        :month="month"
        @close="dialog = false"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import { format } from "date-fns";
import { mdiAlert, mdiCheckBold } from "@mdi/js";
import { getOverlappingShifts } from "@/utils/shift";
import CalendarOverlap from "@/components/calendar/CalendarOverlap";

export default {
  name: "DashboardConflicts",
  components: { CalendarOverlap },
  props: {
    month: {
      type: String,
      default: format(new Date(), "yyyy-MM")
    },
    shifts: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    icons: {
      mdiAlert,
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
