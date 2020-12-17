<template>
  <v-card v-if="lengthAllOverlaps > 0">
    <v-toolbar flat>
      <v-btn icon @click="$emit('close')">
        <v-icon>{{ icons.mdiClose }}</v-icon>
      </v-btn>
      <v-toolbar-title
        >{{ $t("calendar.overlap.resolving") }} {{ month }}</v-toolbar-title
      >
    </v-toolbar>

    <v-card-text>
      <v-row align="center" justify="center">
        <v-btn :disabled="index < 1" text @click="prev">
          <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
        </v-btn>

        <span>{{ index + 1 }} / {{ lengthAllOverlaps }}</span>

        <v-btn :disabled="index == lengthAllOverlaps - 1" text @click="next">
          <v-icon>{{ icons.mdiChevronRight }}</v-icon>
        </v-btn>
      </v-row>
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="primary"
        type="category"
        category-show-all
        :categories="categories"
        :events="events"
        :event-color="getEventColor"
        :locale="locale"
        @click:event="handleEventClick"
      ></v-calendar>
    </v-card-text>

    <FormDialog
      v-if="showForm"
      entity-name="shift"
      :entity="shiftEntity"
      @close="closeFormDialog"
      @refresh="refresh"
    />
  </v-card>
  <v-card v-else>
    <placeholder name="UndrawEmpty">
      {{ $t("calendar.overlap.none") }}
    </placeholder>
  </v-card>
</template>

<script>
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { localizedFormat } from "@/utils/date";
import { getOverlappingShifts } from "@/utils/shift";
import { mdiClose, mdiChevronLeft, mdiChevronRight } from "@mdi/js";

import { Shift } from "@/models/ShiftModel";
import FormDialog from "@/components/FormDialog";

import { mapState, mapGetters } from "vuex";

export default {
  name: "CalendarOverlap",
  components: { FormDialog },
  props: {
    month: {
      type: String,
      required: true
    },
    shifts: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    icons: {
      mdiClose,
      mdiChevronLeft,
      mdiChevronRight
    },
    index: 0,
    showForm: false,
    shiftEntity: null,
    focus: ""
  }),
  computed: {
    ...mapGetters({
      contracts: "contract/contracts"
    }),
    ...mapState({
      locale: "locale"
    }),
    categories() {
      return [
        this.$t("calendar.overlap.all"),
        this.$t("calendar.overlap.overlap")
      ];
    },
    allOverlappingShifts() {
      return getOverlappingShifts(this.shifts).sort((a, b) => {
        return new Date(a[0].date.start) - new Date(b[1].date.start);
      });
    },
    lengthAllOverlaps() {
      return this.allOverlappingShifts.length;
    },
    currentOverlap() {
      return this.allOverlappingShifts[this.index] === undefined
        ? []
        : this.allOverlappingShifts[this.index];
    },
    focussedOverlap() {
      return this.currentOverlap.map((shift, index) => {
        const labels = ["A", "B"];
        const contract = this.contracts.find(
          (contract) => contract.uuid === shift.contract
        );
        return {
          name:
            `(${labels[index]}, ${contract.name}) ` +
            this.$t(`shifts.types.${shift.type}`),
          start: new Date(shift.date.start),
          end: new Date(shift.date.end),
          category: this.categories[1],
          timed: true,
          uuid: shift.uuid,
          color: SHIFT_TYPE_COLORS[shift.type]
        };
      });
    },
    otherShifts() {
      const overlappingId = this.focussedOverlap.map((shift) => shift.uuid);
      return this.shifts
        .filter((shift) => !overlappingId.includes(shift.uuid))
        .map((shift) => {
          return {
            name: this.$t(`shifts.types.${shift.type}`),
            start: new Date(shift.date.start),
            end: new Date(shift.date.end),
            category: this.categories[0],
            timed: true,
            uuid: shift.uuid,
            color: "primary"
          };
        });
    },
    events() {
      if (this.allOverlappingShifts.length < 1) return [];

      return [...this.focussedOverlap, ...this.otherShifts];
    }
  },
  watch: {
    index: {
      handler: function () {
        this.focus = localizedFormat(this.focussedOverlap[0].end, "yyyy-MM-dd");
      },
      immediate: true
    }
  },
  methods: {
    async refresh() {
      await this.$store.dispatch("shift/queryShifts");
    },
    handleEventClick(event) {
      this.editShift(event.event.uuid);
    },
    editShift(uuid) {
      const shift = this.shifts.find((shift) => shift.uuid === uuid);
      this.shiftEntity = new Shift(shift);
      this.showForm = true;
    },
    closeFormDialog() {
      this.showForm = false;
      this.shiftEntity = null;
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.index -= 1;
    },
    next() {
      this.index += 1;
    }
  }
};
</script>
