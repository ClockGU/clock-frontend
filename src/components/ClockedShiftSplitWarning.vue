<template>
  <!-- <portal to="dialog"> -->
  <TheDialog :max-width="400">
    <template v-slot:content>
      <v-card>
        <v-card-title class="headline word-break">
          Shift overflow
        </v-card-title>
        <v-card-text>
          <p>
            A shift must end on the same day it started. Therefore, we will need
            to split your shift. Make a decision on what to do.
          </p>

          <v-row>
            <v-col sm="12" class="pb-0">
              <v-select
                v-model="selected"
                :items="options"
                label="Select an action"
                hide-details
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-list v-if="newShifts">
          <v-subheader>New shifts</v-subheader>
          <v-list-item
            v-for="newShift in newShifts"
            :key="newShift.uuid"
            two-line
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ newShift.representationalDuration("hm") }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ newShift.start | formatDate }} -
                {{ newShift.end | formatDate }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list v-else>
          <v-subheader>Discarding both shifts</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                We will delete both shifts.
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-btn :disabled="!selected" text color="primary" @click="submit">
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </TheDialog>
  <!-- </portal> -->
</template>

<script>
import TheDialog from "@/components/TheDialog";

import { Shift } from "@/models/ShiftModel";

import { eachDayOfInterval, endOfDay, startOfDay } from "date-fns";
const { utcToZonedTime, format } = require("date-fns-tz");

export default {
  name: "ClockedShiftSplitWarning",
  components: {
    TheDialog
  },
  filters: {
    formatDate(date) {
      return format(date, "yyyy-MM-dd HH':'mm");
    }
  },
  props: {
    callbacks: {
      type: Object,
      required: true
    },
    shift: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    timezone: "Europe/Berlin",
    selected: "both",
    options: [
      { text: "Keep both shifts, but split across days", value: "both" },
      { text: "Keep first", value: "first" },
      { text: "Keep second", value: "second" },
      { text: "Discard both", value: "none" }
    ]
  }),
  computed: {
    newShifts() {
      if (this.selected == "both") return this.splitShifts();
      if (this.selected == "first") return this.firstShift();
      if (this.selected == "second") return this.lastShift();

      return null;
    }
  },
  methods: {
    toggleShortShift(callback) {
      callback();
      this.dialog = false;
    },
    submit() {
      console.log(this.newShifts);
    },
    firstShift() {
      let { start } = this.shift.date;
      start = utcToZonedTime(start, this.timezone);
      const shift = new Shift({
        ...this.shift,
        date: { start: start, end: endOfDay(start) }
      });

      return [shift];
    },
    lastShift() {
      let { end } = this.shift.date;
      end = utcToZonedTime(end, this.timezone);
      const shift = new Shift({
        ...this.shift,
        date: { start: startOfDay(end), end: end }
      });

      return [shift];
    },
    splitShifts() {
      return [...this.firstShift(), ...this.lastShift()];
    }
  }
};
</script>
