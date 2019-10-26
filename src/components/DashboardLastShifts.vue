<template>
  <v-card>
    <v-card-title>Last shifts</v-card-title>

    <v-card-text>
      <v-list v-for="shift in lastShifts" :key="shift.uuid">
        <v-list-item
          two-line
          :to="{ name: 'editShift', params: { uuid: shift.uuid } }"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ shift.representationalDuration("hm") }}
              ({{ shift.date.start | formatDate }})
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ shift.date.start | formatTime }} -
              {{ shift.date.end | formatTime }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" text :to="{ name: 'shiftList' }">
        Show more
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { Shift } from "@/models/ShiftModel";
import { format } from "date-fns";

export default {
  name: "DashboardLastShifts",
  filters: {
    formatDate: date => {
      return format(date, "do MMMM yyyy");
    },
    formatTime(date, formatString = "HH:mm a") {
      if (date === undefined) return;
      return format(date, formatString);
    }
  },
  computed: {
    ...mapGetters({
      shifts: "shift/shifts",
      contract: "selectedContract"
    }),
    lastShifts() {
      return this.shifts.slice(-5).map(shift => new Shift(shift));
    }
  }
};
</script>
