<template>
  <v-card min-width="100%">
    <v-container>
      <v-row>
        <v-col cols="8">
          <ShiftFormDialog
            btn-color="primary"
            :initial-date="shiftInitialDate"
          ></ShiftFormDialog>
        </v-col>
        <v-col>
          <v-combobox
            v-model="displayedContracts"
            :label="$t('contracts.displayedContracts') + ':'"
            :items="allContracts"
            item-text="name"
            multiple
          >
            <template #item="{ item }">
              {{ item.name }}
              <v-spacer />
              <v-icon :color="item.color" style="float: right">{{
                mdiCircleSlice8()
              }}</v-icon>
            </template>
          </v-combobox>
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
            :is_calendar="true"
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
              <template #event="{ event, eventParsed, formatTime }">
                <div class="pl-1">
                  <div class="v-event-summary">
                    <span>
                      <strong>{{ formatTime(eventParsed.start) }} </strong>
                      {{ event.duration }}</span
                    >
                    <v-icon class="pr-2" style="float: right; scale: 0.9" dense>
                      {{ event.icon }}
                    </v-icon>
                  </div>
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
import CalendarTypeSelect from "@/components/calendar/CalendarTypeSelect";

import { localizedFormat } from "@/utils/date";
import { mdiCircleSlice8, mdiClose, mdiPlus } from "@mdi/js";
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
    date: null,
    displayedContracts: []
  }),
  computed: {
    ...mapGetters({
      selectedContract: "selectedContract/selectedContract",
      selectedShifts: "contentData/selectedShifts",
      allContracts: "contentData/allContracts",
      locale: "locale"
    }),
    // Keep this for future update of filterable calendar
    // visibleShifts() {
    //   if (this.disabled) return [];
    //   return this.selectedShifts;
    // },
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
    events() {
      let events = [];
      for (const contract of this.displayedContracts) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        let contractShifts = this.$store.getters[
          "contentData/shiftsByContractId"
        ](contract.id);
        events = events.concat(
          contractShifts.map((shift) => {
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
              id: shift.id,
              shift: shift,
              icon: SHIFT_TYPE_ICONS[shift.type]
            };
          })
        );
      }
      return events;
    }
  },
  watch: {
    date(val) {
      this.focus = localizedFormat(val, "yyyy-MM-dd");
    }
  },
  created() {
    this.focus = this.initialFocus;
    this.date = new Date(this.focus);
    this.type = this.initialType;
  },
  async mounted() {
    this.$refs.calendar.checkChange();
    this.displayedContracts = this.allContracts;
  },
  methods: {
    mdiCircleSlice8() {
      return mdiCircleSlice8;
    },
    editEvent(data) {
      this.shift = data.event.shift;
      this.editShift = true;
    },
    intervalFormat(interval) {
      return interval.time;
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
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
