<template>
  <v-card :max-height="800">
    <CardToolbar
      :title="title"
      close-action
      @close="$emit('close')"
    ></CardToolbar>
    <v-card-text style="max-height: 800px">
      <v-row align="center" justify="center">
        <v-btn :disabled="index < 1" text @click="prev">
          <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
        </v-btn>

        <span>{{ index + 1 }} / {{ lengthAllOverlaps }}</span>

        <v-btn :disabled="index === lengthAllOverlaps - 1" text @click="next">
          <v-icon>{{ icons.mdiChevronRight }}</v-icon>
        </v-btn>
      </v-row>
      <div style="max-height: 600px; overflow-y: scroll">
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
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog";
import CardToolbar from "@/components/cards/CardToolbar";

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
  data: () => ({
    icons: {
      mdiClose,
      mdiChevronLeft,
      mdiChevronRight
    },
    index: 0,
    showForm: false,
    shiftEntity: null,
    focus: "",
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
    events() {
      if (this.allOverlappingShifts.length < 1) return [];

      return [...this.focussedOverlap, ...this.otherShifts];
    },
    title() {
      return (
        this.$t("calendar.overlap.resolving") +
        localizedFormat(this.month, "MMMM yyyy")
      );
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
    handleEventClick(event) {
      this.shift = event.event.shift;
      this.editShift = true;
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

<style>
.scroll {
  overflow-y: scroll;
}
.percent-height-50 {
  max-height: 50%;
}
</style>
