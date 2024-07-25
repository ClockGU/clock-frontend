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
            item-title="name"
            multiple
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="modifyProps(props)">
                {{ item.title }}
                <v-icon
                  :color="item.raw.color"
                  :icon="mdiCircleSlice8()"
                  style="float: right"
                ></v-icon>
              </v-list-item>
            </template>
          </v-combobox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <VCalendar
            v-model="focus"
            :events="events"
            :now="today"
            :view-mode="type"
            :first-day-of-week="1"
            @click:event="editEvent"
          >
            <template #header>
              <div class="v-calendar-header">
                <v-col cols="4">
                  <TodayButton v-model="selectedDate" />
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
              </div>
            </template>
            <template #event="{event}">
              <v-chip>
                <v-badge :color="event.contractColor" dot inline></v-badge>
                <div class="pl-1">
                  <div class="icon-center">
                  <span class="pr-1" style="border-right: 2px solid black;">
                    <strong>{{ formatTime(event.start) }} </strong>
                    </span>
                    <span class="ml-1">
                      {{ event.selectedEventDuration }}
                    </span>
                    <v-icon :color="event.iconColor" class="ml-2" :icon="event.icon" style="scale: 0.9">
                    </v-icon>
                  </div>
                </div>
              </v-chip>
            </template>
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
import { HEX_SHIFT_TYPE_COLORS, SHIFT_TYPE_COLORS } from "@/utils/colors";
import { VCalendar } from "vuetify/labs/VCalendar";
import { formatTime } from "@/utils/time";


export default {
  // eslint-disable-next-line vue/multi-word-component-names
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
  emits: ["updateRange"],
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
            return {
              start: shift.started,
              end: shift.stopped,
              contractColor: contract.color,
              title: localizedFormat(shift.started, "HH:mm") + duration,
              selectedEventDuration: shift.representationalDuration(),
              id: shift.id,
              shift: shift,
              icon: SHIFT_TYPE_ICONS[shift.type],
              iconColor: HEX_SHIFT_TYPE_COLORS[shift.type]
            };
          })
        );
      }
      return events;
    }
  },
  watch: {
    selectedDate(val) {
      this.focus = [val];
    }
  },
  created() {
    this.focus = [this.initialFocus];
    this.selectedDate = this.focus[0];
    this.type = this.initialType;
  },
  async mounted() {
    this.displayedContracts = this.allContracts;
  },
  methods: {
    formatDate() {
      return formatDate
    },
    formatTime(date) {
      return formatTime(date);
    },
    mdiCircleSlice8() {
      return mdiCircleSlice8;
    },
    editEvent(data) {
      this.shift = data.event.shift;
      this.editShift = true;
    },
    modifyProps(props) {
      delete props.title;
      return props;
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
        start: {
          day: focus.getDate(),
          month: focus.getMonth(),
          year: focus.getYear()
        }
      });
    },
    isBankHoliday(date) {
      return dateIsHoliday(new Date(date));
    }
  }
};
</script>

<style scoped lang="css">
.icon-center {
  display: inline-flex;
  align-items: center;
}
</style>