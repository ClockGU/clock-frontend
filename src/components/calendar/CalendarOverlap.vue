<template>
  <div v-if="overlappingShifts.length > 1">
    <v-row>
      <v-btn :disabled="index < 1" @click="index--">Previous</v-btn>
      <v-spacer></v-spacer>
      <span>{{ index + 1 }} / {{ overlappingShifts.length }}</span>
      <v-spacer></v-spacer>
      <v-btn :disabled="index == overlappingShifts.length - 1" @click="index++">
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
      :events="overlap"
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
    overlappingShifts() {
      return getOverlappingShifts(this.shifts).sort((a, b) => {
        return new Date(a.modified_at) - new Date(b.modified_at);
      });
    },
    overlap() {
      if (this.overlappingShifts.length < 1) return [];

      const currentOverlap = this.overlappingShifts[this.index].map(
        (shift, index) => {
          return {
            name: `Shift ${index + 1}`,
            start: new Date(shift.date.start),
            end: new Date(shift.date.end),
            category: this.categories[1],
            timed: true,
            uuid: shift.uuid
          };
        }
      );
      const overlappingId = currentOverlap.map(shift => shift.uuid);
      const otherShifts = this.shifts
        .filter(shift => !overlappingId.includes(shift.uuid))
        .map(shift => {
          return {
            name: `Shift`,
            start: new Date(shift.date.start),
            end: new Date(shift.date.end),
            category: this.categories[0],
            timed: true,
            uuid: shift.uuid
          };
        });

      return [...currentOverlap, ...otherShifts];
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
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    }
  }
};
</script>
