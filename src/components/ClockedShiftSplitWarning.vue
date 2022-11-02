<template>
  <v-card
    :elevation="0"
    class="ma-0 pa-0"
    :disabled="disabled"
    data-cy="clicked-shift-split-warning"
  >
    <v-card-text class="pa-0 ma-0">
      {{ $t("dashboard.clock.problems.text") }}
    </v-card-text>

    <v-list class="px-0" data-cy="overflowing-shift">
      <v-subheader class="px-0">
        {{ $t("dashboard.clock.problems.clockedShift") }}
      </v-subheader>
      <v-list-item two-line class="px-0">
        <v-list-item-content>
          <v-list-item-title data-cy="overflowing-shift-duration">
            {{ shift.representationalDuration("hm") }}
          </v-list-item-title>

          <v-list-item-subtitle data-cy="overflowing-shift-dates">
            {{ shift.started | formatDate }} -
            {{ shift.stopped | formatDate }}
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
            :label="$t('dashboard.clock.problems.actions.label')"
            hide-details
            outlined
            @change="initializePseudoShifts"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider></v-divider>

    <v-list class="px-0" data-cy="new-shifts">
      <v-subheader class="px-0">
        {{ $t("dashboard.clock.problems.newShifts") }}
      </v-subheader>
      <v-container v-if="pseudoShifts.length === 0" justify="center">
        {{ $t("dashboard.clock.problems.deletedAll") }}
      </v-container>
      <v-list-item
        v-for="(splitShift, i) in pseudoShifts"
        v-else
        :key="splitShift.id"
        class="px-0"
        two-line
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ splitShift.started | formatDay }}
          </v-list-item-title>
          <v-list-item-subtitle class="text--primary">
            {{ splitShift.started | formatTime }} -
            {{ splitShift.stopped | formatTime }}
            ({{ splitShift.representationalDuration("hm") }})
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <v-chip
              data-cy="shift-list-item-type"
              outlined
              small
              class="my-2"
              :color="typeColor(splitShift)"
            >
              {{ $t(`shifts.types.${splitShift.type}`) }}
            </v-chip>

            <span v-if="splitShift.tags.length > 0">&nbsp;&mdash;&nbsp;</span>

            <v-chip
              v-for="(tag, j) in splitShift.tags"
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
            <template #activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon color="grey lighten-1">
                  {{ icons.mdiDotsVertical }}
                </v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                :data-cy="'edit-' + i"
                @click="editShift(splitShift)"
              >
                <v-list-item-title>
                  {{ $t("actions.edit") }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                :data-cy="'delete-' + i"
                @click="remove(splitShift.id)"
              >
                <v-list-item-title>
                  {{ $t("actions.delete") }}
                </v-list-item-title>
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
        {{
          pseudoShifts.length > 0
            ? $t("actions.save")
            : $t("dashboard.clock.out")
        }}
      </v-btn>
      <v-btn data-cy="reset" text @click="initializePseudoShifts">
        {{ $t("actions.reset") }}
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
import { v4 as uuidv4 } from "uuid";
import { eachDayOfInterval, endOfDay, startOfDay } from "date-fns";
import { mdiDotsVertical } from "@mdi/js";
const { utcToZonedTime, format } = require("date-fns-tz");

import { ShiftService } from "@/services/models";
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { mapGetters } from "vuex";
import ShiftReviewFormDialog from "@/components/shifts/ShiftReviewFormDialog";
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
  data: () => ({
    disabled: false,
    icons: { mdiDotsVertical },
    timezone: "Europe/Berlin",
    selected: "both",
    dialogReset: false,
    pseudoShifts: [],
    shiftEntity: null,
    showFormDialog: false,
    shift: null
  }),
  computed: {
    ...mapGetters({
      clockedShift: "clock/clockedShift"
    }),
    options() {
      return [
        {
          text: this.$t("dashboard.clock.problems.actions.keepBoth"),
          value: "both"
        },
        {
          text: this.$t("dashboard.clock.problems.actions.keepFirst"),
          value: "first"
        },
        {
          text: this.$t("dashboard.clock.problems.actions.keepSecond"),
          value: "second"
        }
        // {
        //   text: this.$t("dashboard.clock.problems.actions.advanced"),
        //   value: "advanced"
        // }
      ];
    },
    editShiftIndex() {
      if (this.shiftEntity === null) return null;

      return this.pseudoShifts.findIndex(
        (shift) => shift.uuid === this.shiftEntity.uuid
      );
    },
    separateDays() {
      return eachDayOfInterval({
        start: this.shift.started,
        end: this.shift.stopped
      });
    }
  },
  created() {
    this.shift = this.clockedShift.clone();
    this.shift.stopped = new Date();
    this.shift.type = "st";
    this.shift.wasReviewed = true;
    this.initializePseudoShifts();
  },
  methods: {
    typeColor(shift) {
      return SHIFT_TYPE_COLORS[shift.type];
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
    remove(id) {
      this.pseudoShifts = this.pseudoShifts.filter((shift) => shift.id !== id);
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
      const shiftPromises = this.pseudoShifts.map((shift) =>
        ShiftService.create(shift.toPayload())
      );

      Promise.all(shiftPromises)
        .then(() => {
          this.$emit("save", this.pseudoShifts.length);
        })
        .catch(() => {
          this.disabled = false;
        });
    },
    firstShift() {
      let start = this.shift.started;
      start = utcToZonedTime(start, this.timezone);
      const shift = this.shift.clone();
      shift.id = uuidv4();
      shift.stopped = endOfDay(start);
      return [shift];
    },
    lastShift() {
      let end = this.shift.stopped;
      end = utcToZonedTime(end, this.timezone);
      const shift = this.shift.clone();
      shift.id = uuidv4();
      shift.started = startOfDay(end);
      return [shift];
    },
    splitShifts() {
      if (this.separateDays.length === 2) {
        return [...this.firstShift(), ...this.lastShift()];
      }

      const middleShifts = this.separateDays.slice(
        1,
        this.separateDays.length - 1
      );
      const newShifts = middleShifts.map((date) => {
        let shift = this.shift.clone();
        shift.id = uuidv4();
        shift.started = startOfDay(date);
        shift.stopped = endOfDay(date);
        return shift;
      });

      return [...this.firstShift(), ...newShifts, ...this.lastShift()];
    }
  }
};
</script>
