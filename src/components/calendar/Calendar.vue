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
          <TodayButton @update="selectedDate = $event" />
        </v-col>
        <v-col class="text-center" cols="4">
          <TimeIntervalSwitcher
            v-model="selectedDate"
            :disabled="disabled"
            :type="type"
            is-calendar
          />
        </v-col>
        <v-col class="text-end" cols="4" order-sm="3">
          <CalendarTypeSelect v-model="type" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
            <VCalendar
              v-model="focus"
              :events="events"
              :now="today"
              :view-mode="type"
              @click:event="editEvent"
            >
<!--              :interval-format="intervalFormat"-->
<!--              @click:event="editEvent"-->
<!--              @click:more="viewDay"-->
<!--              @click:date="viewDay"-->
<!--              @prev="updateRange"-->
<!--              @next="updateRange"-->
<!--            >-->
<!--              <template #day-label="{ day, date }">-->
<!--                <button-->
<!--                  type="button"-->
<!--                  class="v-btn v-btn&#45;&#45;fab v-btn&#45;&#45;has-bg v-btn&#45;&#45;round theme&#45;&#45;light v-size&#45;&#45;small transparent"-->
<!--                  @click="viewDay({ date: date })"-->
<!--                >-->
<!--                  <span class="v-btn__content">{{ day }}</span>-->
<!--                </button>-->
<!--                <v-icon-->
<!--                  v-if="isBankHoliday(date)"-->
<!--                  :color="bhIconColor"-->
<!--                  style="align-self: center"-->
<!--                  >{{ icons.bhIcon }}</v-icon-->
<!--                >-->
<!--              </template>-->
<!--              <template #event="{ event, eventParsed, formatTime }">-->
<!--                <div class="pl-1">-->
<!--                  <div class="v-event-summary">-->
<!--                    <span>-->
<!--                      <strong>{{ formatTime(eventParsed.start) }} </strong>-->
<!--                      {{ event.duration }}</span-->
<!--                    >-->
<!--                    <v-icon class="pr-2" style="float: right; scale: 0.9" dense>-->
<!--                      {{ event.icon }}-->
<!--                    </v-icon>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </template>-->
            </VCalendar>
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
import CalendarTypeSelect from "@/components/calendar/CalendarTypeSelect.vue";
import ShiftFormDialog from "@/components/forms/dialogs/ShiftFormDialog.vue";


import { dateIsHoliday, localizedFormat } from "@/utils/date";
import { mdiCircleSlice8, mdiClose, mdiPlus } from "@mdi/js";
import { mapGetters } from "vuex";
import { isSameMonth, isSameWeek } from "date-fns";
import TodayButton from "@/components/calendar/TodayButton.vue";
import TimeIntervalSwitcher from "@/components/TimeIntervalSwitcher.vue";
import { SHIFT_TYPE_ICONS } from "@/utils/misc";
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { VCalendar } from 'vuetify/labs/VCalendar'

export default {
  name: "Calendar",
  components: {
    TimeIntervalSwitcher,
    TodayButton,
    ShiftFormDialog,
    CalendarTypeSelect,
    VCalendar
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    initialFocus: {
      type: Date,
      default: () => new Date()
    },
    initialType: {
      type: String,
      default: "month"
    }
  },
emits: ['updateRange'],
  data: () => ({
    icons: {
      mdiClose: mdiClose,
      mdiPlus,
      bhIcon: SHIFT_TYPE_ICONS.bh
    },
    today: new Date(),
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
    selectedDate: null,
    displayedContracts: [],
    bhIconColor: SHIFT_TYPE_COLORS.bh
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
      if (
        (this.type === "month" && isSameMonth(this.focus[0], new Date())) ||
        (this.type === "week" && isSameWeek(this.focus[0], new Date()))
      ) {
        return new Date();
      }
      return this.focus[0];
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
                ? " | " + shift.representationalDuration()
                : shift.representationalDuration();
            console.log(shift.started.getMinutes(), localizedFormat(shift.started, "HH:MM"));
            return {
              start: shift.started,
              end: shift.stopped,
              color: contract.color,
              title: localizedFormat(shift.started, "HH:mm") + duration,
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
    selectedDate(val) {
      this.focus = [val,];
    },
  },
  created() {
    this.focus = [this.initialFocus,];
    this.selectedDate = this.focus[0];
    this.type = this.initialType;
  },
  async mounted() {
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
    updateRange(obj) {
      const focus = this.focus[0];
      // Tell parent component the range updated
      this.$emit("updateRange", {
        type: this.type,
        start: { day: focus.getDate(), month: focus.getMonth(), year: focus.getYear() }
      });
    },
    isBankHoliday(date) {
      return dateIsHoliday(new Date(date));
    }
  }
};
</script>
