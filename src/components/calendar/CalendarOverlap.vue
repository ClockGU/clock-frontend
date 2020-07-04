<template>
  <div v-if="lengthAllOverlaps > 0">
    <v-row>
      <v-btn :disabled="index < 1" @click="prev">Previous</v-btn>
      <v-spacer></v-spacer>
      <span>{{ index + 1 }} / {{ lengthAllOverlaps }}</span>
      <v-spacer></v-spacer>
      <v-btn :disabled="index == lengthAllOverlaps - 1" @click="next">
        Next
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
      @click:event="handleEventClick"
    ></v-calendar>

    <FormDialog
      v-if="showForm"
      entity-name="shift"
      :entity="shiftEntity"
      @close="closeFormDialog"
      @refresh="refresh"
    />
  </div>
  <v-card v-else>
    <placeholder name="UndrawEmpty">
      There are no overlapping shifts. You're good!
    </placeholder>
  </v-card>
</template>

<script>
import { format } from "date-fns";
import { getOverlappingShifts } from "@/utils/shift";
import { mapGetters } from "vuex";

import { Shift } from "@/models/ShiftModel";
import FormDialog from "@/components/FormDialog";

export default {
  name: "CalendarOverlap",
  components: { FormDialog },
  data: () => ({
    index: 0,
    showForm: false,
    shiftEntity: null,
    focus: "",
    categories: ["All shift", "Overlapping shift"]
  }),
  computed: {
    ...mapGetters({
      shifts: "shift/shifts"
    }),
    allOverlappingShifts() {
      return getOverlappingShifts(this.shifts).sort((a, b) => {
        return new Date(a[0].date.start) - new Date(b[1].date.start);
      });
    },
    lengthAllOverlaps() {
      return this.allOverlappingShifts.length;
    },
    focussedOverlap() {
      return this.allOverlappingShifts[this.index].map((shift, index) => {
        return {
          name: `Shift ${index + 1}`,
          start: new Date(shift.date.start),
          end: new Date(shift.date.end),
          category: this.categories[1],
          timed: true,
          uuid: shift.uuid,
          color: index === 0 ? "green" : "red"
        };
      });
    },
    otherShifts() {
      const overlappingId = this.focussedOverlap.map(shift => shift.uuid);
      return this.shifts
        .filter(shift => !overlappingId.includes(shift.uuid))
        .map(shift => {
          return {
            name: `Shift`,
            start: new Date(shift.date.start),
            end: new Date(shift.date.end),
            category: this.categories[0],
            timed: true,
            uuid: shift.uuid,
            color: "grey"
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
      handler: function() {
        this.focus = format(this.focussedOverlap[0].end, "yyyy-MM-dd");
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
      const shift = this.shifts.find(shift => shift.uuid === uuid);
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
