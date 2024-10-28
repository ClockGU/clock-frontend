<template>
  <v-card :max-height="800">
    <CardToolbar
      :title="title"
      close-action
      @close="$emit('close')"
    ></CardToolbar>
    <v-card-text style="max-height: 800px">
      <v-row align="center" justify="center">
        <v-btn :disabled="index < 1" variant="text" @click="prev">
          <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
        </v-btn>

        <span>{{ index + 1 }} / {{ lengthAllOverlaps }}</span>

        <v-btn
          :disabled="index === lengthAllOverlaps - 1"
          variant="text"
          @click="next"
        >
          <v-icon>{{ icons.mdiChevronRight }}</v-icon>
        </v-btn>
      </v-row>
      <div style="max-height: 600px; overflow-y: scroll">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Time</th>
                <th class="text-left">Shift 1</th>
                <th class="text-left">Shift 2</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(time, index) in timeStamps" :key="index">
                <td>{{ time }}</td>
                <td v-if="isWithinShift(time, focussedOverlap[0])" :style="{ backgroundColor: focussedOverlap[0].color }">{{ focussedOverlap[0].name }}</td>
                <td v-else></td>
                <td v-if="isWithinShift(time, focussedOverlap[1])" :style="{ backgroundColor: focussedOverlap[1].color }">{{ focussedOverlap[1].name }}</td>
                <td v-else></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </v-card-text>
    <ShiftFormDialog
      :shift="shift"
      :value="editShift"
      disable-activator
      @close="editShift = false"
    ></ShiftFormDialog>
  </v-card>
</template>

<script>
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { localizedFormat } from "@/utils/date";
import { getOverlappingShifts } from "@/utils/shift";
import { mdiClose, mdiChevronLeft, mdiChevronRight } from "@mdi/js";

import { mapState, mapGetters } from "vuex";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";
import CardToolbar from "@/components/cards/CardToolbar.vue";


export default {
  name: "CalendarOverlap",
  components: { CardToolbar, ShiftFormDialog },
  props: {
    month: {
      type: Date,
      required: true
    },
    shifts: {
      type: Array,
      required: true
    }
  },
  emits: ["close"],
  data: () => ({
    icons: {
      mdiClose,
      mdiChevronLeft,
      mdiChevronRight
    },
    index: 0,
    showForm: false,
    shiftEntity: null,
    editShift: false,
    shift: undefined
  }),
  computed: {
    ...mapGetters({
      contracts: "contentData/allContracts"
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
        return a[0].started - b[1].started;
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
        const contract = this.$store.getters["contentData/contractById"](
          shift.contract
        );
        return {
          name:
            `(${labels[index]}, ${contract.name}) ` +
            this.$t(`shifts.types.${shift.type}`),
          start: shift.started,
          end: shift.stopped,
          category: this.categories[1],
          timed: true,
          shift: shift,
          color: SHIFT_TYPE_COLORS[shift.type]
        };
      });
    },
    otherShifts() {
      const overlappingId = this.focussedOverlap.map((shift) => shift.id);
      return this.shifts
        .filter((shift) => !overlappingId.includes(shift.id))
        .map((shift) => {
          return {
            name: this.$t(`shifts.types.${shift.type}`),
            start: shift.started,
            end: shift.stopped,
            category: this.categories[0],
            timed: true,
            shift: shift,
            color: "primary"
          };
        });
    },
    title() {
      return (
        this.$t("calendar.overlap.resolving") +
        localizedFormat(this.month, "MMMM yyyy")
      );
    }
  },
  methods: {
    handleEventClick(event) {
      this.shift = event.event.shift;
      this.editShift = true;
    },
    prev() {
      this.index -= 1;
    },
    next() {
      this.index += 1;
    },
    getTimeStamps() {
      const startHour = Math.min(this.focussedOverlap[0].start.getHours(), this.focussedOverlap[1].start.getHours()) - 1;
      const endHour = Math.max(this.focussedOverlap[0].end.getHours(), this.focussedOverlap[1].end.getHours()) + 1;
      const timeStamps = [];
      for (let i = startHour; i <= endHour; i++) {
        timeStamps.push(`${i}:00`);
      }
      return timeStamps;
    },
    isWithinShift(time, shift) {
      const hour = parseInt(time.split(':')[0]);
      return hour >= shift.start.getHours() && hour < shift.end.getHours();
    }
  }
};
</script>

<style>
.scroll {
  overflow-y: scroll;
}
.percent-height-50 {
  max-height: 50%;
}
</style>
