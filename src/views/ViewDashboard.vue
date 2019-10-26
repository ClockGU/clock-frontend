<template>
  <v-row>
    <v-col sm="12" md="4">
      <ContractListCardSelect :contract="contract" />
    </v-col>

    <v-col sm="12" md="4">
      <v-sparkline
        fill
        :gradient="gradient"
        :padding="padding"
        :smooth="radius || false"
        :value="value"
        auto-draw
      ></v-sparkline>
    </v-col>

    <v-col sm="12" md="4">
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
          <v-btn color="primary" text @click="() => {}">Show more</v-btn>
        </v-card-actions>
      </v-card>
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

import { mapGetters } from "vuex";
import { Shift } from "@/models/ShiftModel";

import { format } from "date-fns";

export default {
  name: "ViewDashboard",
  filters: {
    formatDate: date => {
      return format(date, "do MMMM yyyy");
    },
    formatTime(date, formatString = "HH:mm a") {
      if (date === undefined) return;
      return format(date, formatString);
    }
  },
  components: {
    ContractListCardSelect
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
    }),
    lastShifts() {
      return this.shifts.slice(-5).map(shift => new Shift(shift));
    }
  }
};
</script>
