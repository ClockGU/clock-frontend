<template>
  <v-card>
    <v-card-title class="headline word-break">
      Shift overflow
    </v-card-title>
    <v-card-text>
      <p>
        A shift must end on the same day it started. Therefore, we will need to
        split your shift. Make a decision on what to do.
      </p>

      <v-row align="stretch">
        <v-col sm="10" class="pb-0">
          <v-select
            v-model="selected"
            :items="options"
            label="Select an action"
            hide-details
            outlined
            :disabled="!persistPseudoShiftToVuex"
            @change="setPseudoShifts"
          ></v-select>
        </v-col>
        <v-col sm="2">
          <v-btn
            text
            x-large
            :disabled="persistPseudoShiftToVuex"
            @click="setPseudoShifts"
          >
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-list>
      <v-subheader>Overflowing shift</v-subheader>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>
            {{ shift.representationalDuration("hm") }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ shift.start | formatDate }} -
            {{ shift.end | formatDate }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list v-if="shifts">
      <v-subheader>New shifts</v-subheader>
      <v-list-item
        v-for="newShift in shifts"
        :key="newShift.uuid"
        two-line
        @click="editShift(newShift)"
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

<script>
import { Shift } from "@/models/ShiftModel";
import uuid from "uuid/v4";
import { endOfDay, startOfDay } from "date-fns";
const { utcToZonedTime, format } = require("date-fns-tz");

import ShiftService from "@/services/shift.service";

import equals from "ramda/src/equals";

export default {
  name: "ClockedShiftSplitWarning",
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
    },
    pseudoShifts: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    timezone: "Europe/Berlin",
    selected: "both",
    options: [
      { text: "Keep both shifts and split across days", value: "both" },
      { text: "Keep first", value: "first" },
      { text: "Keep second", value: "second" },
      { text: "Discard both", value: "none" }
    ]
  }),
  computed: {
    shifts() {
      if (this.persistPseudoShiftToVuex) return this.newShifts;

      return this.pseudoShifts.map(shift => new Shift(shift));
    },
    newShifts() {
      if (this.selected == "both") return this.splitShifts();
      if (this.selected == "first") return this.firstShift();
      if (this.selected == "second") return this.lastShift();

      return null;
    },
    persistPseudoShiftToVuex() {
      const pseudoShifts = this.pseudoShifts.map(shift => {
        const item = new Shift(shift).toPayload();
        return { ...item, uuid: null };
      });
      const newShifts = this.newShifts.map(shift => {
        const item = new Shift(shift).toPayload();
        return { ...item, uuid: null };
      });

      if (this.pseudoShifts.length == 0) return true;

      return equals(pseudoShifts, newShifts);
    }
  },
  created() {
    if (this.persistPseudoShiftToVuex) this.setPseudoShifts();
  },
  methods: {
    setPseudoShifts() {
      this.$emit("pseudoShifts", this.newShifts);
    },
    editShift(shift) {
      this.$emit("editShift", shift);
    },
    toggleShortShift(callback) {
      callback();
      this.dialog = false;
    },
    submit() {
      this.shifts.map(shift => ShiftService.create(shift.toPayload()));
      this.$emit("close");
      this.callbacks.reset();
    },
    firstShift() {
      let { start } = this.shift.date;
      start = utcToZonedTime(start, this.timezone);
      const shift = new Shift({
        ...this.shift,
        uuid: uuid(),
        date: { start: start, end: endOfDay(start) }
      });

      return [shift];
    },
    lastShift() {
      let { end } = this.shift.date;
      end = utcToZonedTime(end, this.timezone);
      const shift = new Shift({
        ...this.shift,
        uuid: uuid(),
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
