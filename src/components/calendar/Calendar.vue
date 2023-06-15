<template>
  <v-container class="pb-0" style="height: 100%">
    <v-sheet>
      <v-container>
        <v-row
          align="center"
          justify="space-between"
          height="100px"
          flat
          color="white"
        >
          <v-col class="px-0" cols="12">
            <SelectContractFilter :disabled="disabled" />
          </v-col>
          <v-col class="px-0" cols="12">
            <ShiftFormDialog
              btn-color="primary"
              :initial-date="shiftInitialDate"
            ></ShiftFormDialog>
          </v-col>

          <v-col class="px-0" cols="12" sm="5">
            <CalendarNavigationButtons
              @today="setToday"
              @next="next"
              @prev="prev"
            />
          </v-col>

          <v-col class="px-0" cols="12" sm="3" order-sm="3">
            <CalendarTypeSelect v-model="type" />
          </v-col>

          <v-col class="px-0" cols="12" sm="4" order-sm="2">
            <span data-cy="calendar-title">
              {{ monthYearDisplay }}
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-sheet height="600px">
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="primary lighten-1"
        event-name="duration"
        :events="events"
        :event-color="getEventColor"
        :event-margin-bottom="3"
        :locale="locale"
        :now="today"
        :type="type"
        :weekdays="weekdays"
        :interval-format="intervalFormat"
        @click:event="editEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="updateRange"
      ></v-calendar>
    </v-sheet>
    <ShiftFormDialog
      :shift="shift"
      :value="editShift"
      disable-activator
      @close="editShift = false"
    ></ShiftFormDialog>
  </v-container>
</template>

<script>
import { formatDate } from "@/utils/time";
import { SHIFT_TYPE_COLORS } from "@/utils/colors";

import CalendarNavigationButtons from "@/components/calendar/CalendarNavigationButtons";
import CalendarTypeSelect from "@/components/calendar/CalendarTypeSelect";
import SelectContractFilter from "@/components/SelectContractFilter";

import { firstOfCurrentMonth, localizedFormat } from "@/utils/date";
import { mdiClose, mdiPlus } from "@mdi/js";
import { mapGetters } from "vuex";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog";
import { isSameMonth, isSameWeek } from "date-fns";

export default {
  name: "Calendar",
  components: {
    ShiftFormDialog,
    CalendarNavigationButtons,
    CalendarTypeSelect,
    SelectContractFilter
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    initialFocus: {
      type: String,
      default: () => localizedFormat(new Date(), "yyyy-MM-dd")
    },
    initialType: {
      type: String,
      default: "month"
    }
  },
  data: () => ({
    icons: {
      mdiClose: mdiClose,
      mdiPlus
    },
    today: localizedFormat(new Date(), "yyyy-MM-dd"),
    focus: null,
    type: "month",
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    eventClicks: 0,
    doubleClickTimer: null,
    doubleClickDelay: 500,
    editShift: false,
    shift: undefined
  }),
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract/selectedContract",
      selectedShifts: "contentData/selectedShifts",
      locale: "locale"
    }),
    visibleShifts() {
      if (this.disabled) return [];
      return this.selectedShifts;
    },
    shiftInitialDate() {
      const focusMonth = new Date(this.focus);
      if (
        (this.type === "month" && isSameMonth(focusMonth, new Date())) ||
        (this.type === "week" && isSameWeek(focusMonth, new Date()))
      ) {
        return new Date();
      }
      return new Date(this.focus);
    },
    monthYearDisplay() {
      return localizedFormat(new Date(this.focus), "MMMM yyyy");
    },
    events() {
      return this.visibleShifts.map((shift) => {
        const duration =
          this.type === "month"
            ? "| " + shift.representationalDuration()
            : shift.representationalDuration();

        return {
          start: localizedFormat(shift.started, "yyyy-MM-dd HH:mm"),
          end: localizedFormat(shift.stopped, "yyyy-MM-dd HH:mm"),
          color: this.colorMap(shift),
          duration: duration,
          selectedEventDuration: shift.representationalDuration(),
          shift: shift
        };
      });
    }
  },
  async mounted() {
    this.$refs.calendar.checkChange();
  },
  created() {
    this.focus = this.initialFocus;
    this.type = this.initialType;
  },
  methods: {
    editEvent(data) {
      this.shift = data.event.shift;
      this.editShift = true;
    },
    formatDate(value) {
      return formatDate(value);
    },
    intervalFormat(interval) {
      return interval.time;
    },
    colorMap(event) {
      return SHIFT_TYPE_COLORS[event.type];
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.reviewed
        ? event.color + " lighten-1"
        : event.color + " lighten-3";
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;

      const [year, month, day] = this.focus.split("-");

      // Tell parent component the range updated
      this.$emit("updateRange", {
        type: this.type,
        start: { day, month, year }
      });
    }
  }
};
</script>
