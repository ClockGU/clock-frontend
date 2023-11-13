<template>
  <v-card min-width="100%">
    <v-container>
      <v-row>
        <v-col cols="12">
          <ShiftFormDialog
            btn-color="primary"
            :initial-date="shiftInitialDate"
          ></ShiftFormDialog>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <TodayButton @update="date = $event" />
        </v-col>
        <v-col class="text-center" cols="4">
          <TimeIntervalSwitcher
            v-model="date"
            :disabled="disabled"
            :type="type"
          />
        </v-col>
        <v-col class="text-end" cols="4" order-sm="3">
          <CalendarTypeSelect v-model="type" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
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
            >
              <template
                #event="{ event, eventParsed, eventSummary, formatTime }"
              >
                <div
                  class="v-event-summary"
                  :style="{ backgroundColor: event.color }"
                >
                  <span class="pl-2">{{
                    formatTime(eventParsed.start) + event.duration
                  }}</span>
                  <v-icon class="pr-2" style="float: right" dense>
                    {{ event.icon }}
                  </v-icon>
                </div>
              </template>
            </v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <ShiftFormDialog
      :shift="shift"
      :value="editShift"
      disable-activator
      @close="editShift = false"
    ></ShiftFormDialog>
  </v-card>
</template>

<script>
import { formatDate } from "@/utils/time";
import { SHIFT_TYPE_COLORS } from "@/utils/colors";

import CalendarTypeSelect from "@/components/calendar/CalendarTypeSelect";

import { localizedFormat } from "@/utils/date";
import { mdiClose, mdiPlus } from "@mdi/js";
import { mapGetters } from "vuex";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog";
import { isSameMonth, isSameWeek } from "date-fns";
import TodayButton from "@/components/calendar/TodayButton";
import TimeIntervalSwitcher from "@/components/TimeIntervalSwitcher.vue";
import { SHIFT_TYPE_ICONS } from "@/utils/misc";

export default {
  name: "Calendar",
  components: {
    TimeIntervalSwitcher,
    TodayButton,
    ShiftFormDialog,
    // CalendarNavigationButtons,
    CalendarTypeSelect
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
    shift: undefined,
    date: null
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
      let events = [];
      for (const contract of this.$store.getters["contentData/allContracts"]) {
        events = events.concat(
          this.$store.getters["contentData/shiftsByContractId"](
            contract.id
          ).map((shift) => {
            const duration =
              this.type === "month"
                ? "| " + shift.representationalDuration()
                : shift.representationalDuration();

            return {
              start: localizedFormat(shift.started, "yyyy-MM-dd HH:mm"),
              end: localizedFormat(shift.stopped, "yyyy-MM-dd HH:mm"),
              color: contract.color,
              duration: duration,
              selectedEventDuration: shift.representationalDuration(),
              icon: SHIFT_TYPE_ICONS[shift.type]
            };
          })
        );
      }
      console.log(events);
      return events;
    }
  },
  watch: {
    date(val) {
      this.focus = localizedFormat(val, "yyyy-MM-dd");
    }
  },
  async mounted() {
    this.$refs.calendar.checkChange();
  },
  created() {
    this.focus = this.initialFocus;
    this.date = new Date(this.focus);
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
