<template>
  <v-card data-cy="clicked-shift-split-warning">
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
            data-cy="select"
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
            data-cy="reset"
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

    <v-list data-cy="overflowing-shift">
      <v-subheader>Overflowing shift</v-subheader>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title data-cy="overflowing-shift-duration">
            {{ shift.representationalDuration("hm") }}
          </v-list-item-title>

          <v-list-item-subtitle data-cy="overflowing-shift-dates">
            {{ shift.start | formatDate }} -
            {{ shift.end | formatDate }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list v-if="shifts" data-cy="new-shifts">
      <v-subheader>New shifts</v-subheader>
      <v-list-item
        v-for="(newShift, i) in shifts"
        :key="newShift.uuid"
        two-line
      >
        <v-list-item-content>
          <v-list-item-title :data-cy="'new-shift-duration-' + i">
            {{ newShift.representationalDuration("hm") }}
          </v-list-item-title>
          <v-list-item-subtitle :data-cy="'new-shift-dates-' + i">
            {{ newShift.start | formatDate }} -
            {{ newShift.end | formatDate }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action :data-cy="'options-' + i">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon color="grey lighten-1">
                  {{ icons.mdiDotsVertical }}
                </v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item :data-cy="'edit-' + i" @click="editShift(newShift)">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item
                :data-cy="'delete-' + i"
                @click="deleteShift(newShift)"
              >
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-action>
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
      <v-btn
        data-cy="save"
        :disabled="!selected"
        text
        color="primary"
        @click="submit"
      >
        Save
      </v-btn>
      <v-dialog v-model="dialogReset" max-width="350">
        <template v-slot:activator="{ on }">
          <v-btn data-cy="discard" :disabled="!selected" text v-on="on">
            Discard
          </v-btn>
        </template>

        <v-card data-cy="discard-dialog">
          <v-card-title class="headline" primary-title>
            Discard shift
          </v-card-title>

          <v-card-text>
            Do really want to discard the shift? This action is permanent.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn data-cy="dialog-confirm" color="error" text @click="reset">
              Confirm
            </v-btn>
            <v-btn data-cy="dialog-cancel" text @click="dialogReset = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Shift } from "@/models/ShiftModel";
import uuid from "uuid/v4";
import { eachDayOfInterval, endOfDay, startOfDay } from "date-fns";
const { utcToZonedTime, format } = require("date-fns-tz");

import ShiftService from "@/services/shift";

import { mdiDotsHorizontal, mdiDotsVertical } from "@mdi/js";

import equals from "ramda/src/equals";

import { handleApiError } from "@/utils/interceptors";

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
    icons: { mdiDotsHorizontal, mdiDotsVertical },
    timezone: "Europe/Berlin",
    selected: "both",
    options: [
      { text: "Keep both shifts and split across days", value: "both" },
      { text: "Keep first", value: "first" },
      { text: "Keep second", value: "second" }
      // { text: "Discard both", value: "none" }
    ],
    dialogReset: false
  }),
  computed: {
    separateDays() {
      const { start, end } = this.shift.date;
      const days = eachDayOfInterval({
        start: start,
        end: end
      });

      return days;
    },
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
  watch: {
    pseudoShifts: function(newValue) {
      // Reset pseudo shifts, if we have deleted all manually.
      if (newValue.length < 1) {
        this.setPseudoShifts();
      }
    }
  },
  created() {
    this.setPseudoShifts();
    // TODO: What edgecase was this check for?
    // if (!this.persistPseudoShiftToVuex) this.setPseudoShifts();
  },
  methods: {
    deleteShift(shift) {
      const filteredShifts = this.pseudoShifts.filter(
        newShift => newShift.uuid !== shift.uuid
      );
      this.$emit("pseudoShifts", filteredShifts);
    },
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
      this.shifts.map(shift =>
        ShiftService.create(shift.toPayload()).catch(handleApiError)
      );
      this.$emit("close");
      this.callbacks.reset();
    },
    reset() {
      this.callbacks.reset();
      this.$emit("close");
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
      if (this.separateDays.length == 2) {
        return [...this.firstShift(), ...this.lastShift()];
      }

      const middleShifts = this.separateDays.slice(
        1,
        this.separateDays.length - 1
      );
      const newShifts = middleShifts.map(date => {
        return new Shift({
          ...this.shift,
          uuid: uuid(),
          date: {
            start: startOfDay(date),
            end: endOfDay(date)
          }
        });
      });

      return [...this.firstShift(), ...newShifts, ...this.lastShift()];
    }
  }
};
</script>
