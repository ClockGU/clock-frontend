<template>
  <v-card
    :elevation="0"
    class="ma-0 pa-0"
    :disabled="disabled"
    data-cy="clicked-shift-split-warning"
  >
    <v-card-text class="pa-0 ma-0">
      A shift must end on the same day it started. Therefore, we will need to
      split your shift. Make a decision on what to do.
    </v-card-text>

    <v-list class="px-0" data-cy="overflowing-shift">
      <v-subheader class="px-0">Clocked shift</v-subheader>
      <v-list-item two-line class="px-0">
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

    <v-card-text class="px-0">
      <v-row>
        <v-col>
          <v-select
            v-model="selected"
            data-cy="select"
            :items="options"
            label="Select an action"
            hide-details
            outlined
            @change="initializePseudoShifts"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider></v-divider>

    <v-list class="px-0" data-cy="new-shifts">
      <v-subheader class="px-0">New shifts</v-subheader>
      <v-list-item
        v-for="(shift, i) in pseudoShifts"
        :key="shift.uuid"
        class="px-0"
        two-line
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ shift.date.start | formatDay }}
          </v-list-item-title>
          <v-list-item-subtitle class="text--primary">
            {{ shift.date.start | formatTime }} -
            {{ shift.date.end | formatTime }}
            ({{ shift.representationalDuration("hm") }})
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <v-chip
              data-cy="shift-list-item-type"
              outlined
              small
              class="my-2"
              :color="typeColor(shift)"
            >
              {{ shift.type.text }}
            </v-chip>

            <span v-if="shift.tags.length > 0">&nbsp;&mdash;&nbsp;</span>

            <v-chip
              v-for="(tag, j) in shift.tags"
              :key="tag"
              :data-cy="'shift-list-item-tag-' + j"
              outlined
              small
              class="my-2"
            >
              {{ tag }}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action
          v-if="selected === 'advanced'"
          :data-cy="'options-' + i"
        >
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon color="grey lighten-1">
                  {{ icons.mdiDotsVertical }}
                </v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item :data-cy="'edit-' + i" @click="editShift(shift)">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item :data-cy="'delete-' + i" @click="remove(shift.uuid)">
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-card-actions class="px-0">
      <v-btn
        data-cy="save"
        :disabled="!selected"
        text
        color="primary"
        @click="save"
      >
        Save
      </v-btn>
      <v-btn data-cy="reset" text @click="initializePseudoShifts">
        Reset
      </v-btn>
    </v-card-actions>

    <ShiftReviewFormDialog
      v-if="showFormDialog"
      :shift-entity="shiftEntity"
      :uuid="1"
      @close="close"
      @update="update"
    />
  </v-card>
</template>

<script>
import uuid from "uuid/v4";
import { eachDayOfInterval, endOfDay, startOfDay } from "date-fns";
import { mdiDotsVertical } from "@mdi/js";
const { utcToZonedTime, format } = require("date-fns-tz");

import ShiftReviewFormDialog from "@/components/shifts/ShiftReviewFormDialog";
import ShiftService from "@/services/shift";
import { Shift } from "@/models/ShiftModel";
import { SHIFT_TYPE_COLORS } from "@/utils/colors";

export default {
  name: "ClockedShiftSplitWarning",
  filters: {
    formatDay(date) {
      return format(date, "EEEE',' do");
    },
    formatDate(date) {
      return format(date, "dd'.'MM'.' HH':'mm");
    },
    formatTime(date) {
      return format(date, "HH':'mm");
    }
  },
  components: { ShiftReviewFormDialog },
  props: {
    clockedShift: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    disabled: false,
    icons: { mdiDotsVertical },
    timezone: "Europe/Berlin",
    selected: "both",
    options: [
      { text: "Keep both shifts and split across days", value: "both" },
      { text: "Keep first", value: "first" },
      { text: "Keep second", value: "second" },
      { text: "Advanced mode", value: "advanced" }
    ],
    dialogReset: false,
    pseudoShifts: [],
    shiftEntity: null,
    showFormDialog: false
  }),
  computed: {
    editShiftIndex() {
      if (this.shiftEntity === null) return null;

      return this.pseudoShifts.findIndex(
        shift => shift.uuid === this.shiftEntity.uuid
      );
    },
    separateDays() {
      const { start, end } = this.shift.date;
      const days = eachDayOfInterval({
        start: start,
        end: end
      });

      return days;
    }
  },
  created() {
    this.shift = new Shift({
      ...this.clockedShift,
      date: { start: this.clockedShift.started, end: new Date() },
      type: "st"
    });

    this.initializePseudoShifts();
  },
  methods: {
    typeColor(shift) {
      return SHIFT_TYPE_COLORS[shift.type.value];
    },
    close() {
      this.shiftEntity = null;
      this.showFormDialog = false;
    },
    update(shift) {
      const shifts = this.pseudoShifts;
      shifts[this.editShiftIndex] = shift;
      this.pseudoShifts = [...shifts];

      this.close();
    },
    initializePseudoShifts() {
      const SHIFT_CASES = {
        both: this.splitShifts,
        first: this.firstShift,
        second: this.lastShift,
        advanced: this.splitShifts
      };
      this.pseudoShifts = SHIFT_CASES[this.selected]();
    },
    remove(uuid) {
      this.pseudoShifts = this.pseudoShifts.filter(
        shift => shift.uuid !== uuid
      );
    },
    editShift(shift) {
      this.shiftEntity = shift;
      this.showFormDialog = true;
    },
    toggleShortShift(callback) {
      callback();
      this.dialog = false;
    },
    save() {
      this.disabled = true;
      const shiftPromises = this.pseudoShifts.map(shift =>
        ShiftService.create(shift.toPayload())
      );

      Promise.all(shiftPromises)
        .then(() => {
          this.$emit("save");
        })
        .catch(() => {
          this.disabled = false;
        });
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
