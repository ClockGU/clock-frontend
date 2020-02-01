<template>
  <div style="height: 100%">
    <v-sheet>
      <v-row align="center" height="100px" flat color="white" class="px-4">
        <v-col cols="8" md="4" offset-md="1" sm="5" order="1">
          <CalendarNavigationButtons
            @today="setToday"
            @next="next"
            @prev="prev"
          />
        </v-col>

        <v-col cols="6" sm="4" order="3" order-sm="2">
          <span data-cy="calendar-title">
            {{ title }}
          </span>
        </v-col>

        <v-col cols="4" sm="3" order="2" order-sm="3">
          <CalendarTypeSelect v-model="type" />
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet :height="$vuetify.breakpoint.xsOnly ? '84%' : '92%'">
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="primary lighten-2"
        event-name="duration"
        :events="events"
        :event-color="getEventColor"
        :event-margin-bottom="3"
        :now="today"
        :type="type"
        :weekdays="weekdays"
        :interval-format="intervalFormat"
        @click:event="handleEventClick"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="updateRange"
      ></v-calendar>

      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card
          color="grey lighten-4"
          min-width="350px"
          flat
          data-cy="calendar-selected-event"
        >
          <v-toolbar :color="selectedEvent.color" dark>
            <v-btn icon @click="selectedOpen = false">
              <v-icon>{{ icons.mdiClose }}</v-icon>
            </v-btn>
            <v-toolbar-title data-cy="calendar-selected-event-type">
              Type: {{ selectedEvent.type }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text data-cy="calendar-selected-event-text">
            <h2 class="title primary-text">
              {{ selectedEvent.selectedEventDuration }} on
              {{ selectedEvent.start | formatDate }}
            </h2>
            From {{ selectedEvent.start | formatTime }} until
            {{ selectedEvent.end | formatTime }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="primary"
              :disabled="selectedEvent.exported"
              data-cy="calendar-selected-event-edit"
              @click="editShift(selectedEvent.uuid)"
            >
              Edit
            </v-btn>
            <v-btn
              text
              :disabled="selectedEvent.exported"
              data-cy="calendar-selected-event-delete"
              @click="confirmDelete(selectedEvent.uuid)"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

      <TheDialog v-if="dialog" @close="dialog = false">
        <template v-slot:content>
          <v-card data-cy="calendar-delete-shift-dialog">
            <v-card-title class="headline"
              >You sure you want to delete this shift?</v-card-title
            >
            <v-card-text>
              <p>
                This action is not reversible.
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="error"
                text
                data-cy="calendar-delete-shift-confirm"
                @click="destroy"
              >
                Delete
              </v-btn>
              <v-btn
                text
                data-cy="calendar-delete-shift-cancel"
                @click="dialog = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </TheDialog>

      <ShiftFormDialog
        v-if="shiftEntity !== null"
        :shift-entity="shiftEntity"
        :now="shiftNow"
        @close="shiftEntity = null"
        @refresh="$emit('refresh')"
      />

      <TheFAB :to="null" :click="newShift" />
    </v-sheet>
  </div>
</template>

<script>
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { Shift } from "@/models/ShiftModel";
import { Contract } from "@/models/ContractModel";
import ShiftService from "@/services/shift";
import { handleApiError } from "@/utils/interceptors";

import ShiftFormDialog from "@/components/shifts/ShiftFormDialog";
import CalendarNavigationButtons from "@/components/calendar/CalendarNavigationButtons";
import CalendarTypeSelect from "@/components/calendar/CalendarTypeSelect";
import TheDialog from "@/components/TheDialog";
import TheFAB from "@/components/TheFAB";

import { format, parseISO } from "date-fns";
import { mdiClose, mdiPlus } from "@mdi/js";
import { mapState } from "vuex";

export default {
  name: "Calendar",
  components: {
    CalendarNavigationButtons,
    CalendarTypeSelect,
    ShiftFormDialog,
    TheDialog,
    TheFAB
  },
  filters: {
    formatDate(date, formatString = "do MMMM yyyy") {
      if (date === undefined) return;
      return format(parseISO(date), formatString);
    },
    formatTime(date, formatString = "HH:mm a") {
      if (date === undefined) return;
      return format(parseISO(date), formatString);
    }
  },
  props: {
    initialFocus: {
      type: String,
      default: () => format(new Date(), "yyyy-MM-dd")
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
    dialog: false,
    today: format(new Date(), "yyyy-MM-dd"),
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
    shiftEntity: null
  }),
  computed: {
    shiftNow() {
      const now = new Date();
      const [year, month, day] = this.focus.split("-");

      return new Date(year, month, day, now.getHours(), now.getMinutes());
    },
    visibleShifts() {
      return this.shifts.filter(
        shift => shift.contract === this.$store.state.selectedContract.uuid
      );
    },
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    },
    events() {
      return this.visibleShifts.map(item => {
        const shift = new Shift(item);
        const contract = new Contract(
          this.contracts.find(contract => contract.id === shift.contract)
        );

        const duration =
          this.type === "month"
            ? "- " + shift.representationalDuration()
            : shift.representationalDuration();

        return {
          uuid: shift.uuid,
          start: format(shift.date.start, "yyyy-MM-dd HH:mm"),
          end: format(shift.date.end, "yyyy-MM-dd HH:mm"),
          type: shift.type.text,
          color: this.colorMap(shift),
          duration: duration,
          selectedEventDuration: shift.representationalDuration(),
          contract: contract,
          exported: shift.exported
        };
      });
    },
    ...mapState({
      contracts: state => state.contract.contracts,
      locale: state => state.calendar.locale,
      shifts: state => state.shift.shifts
    })
  },
  mounted() {
    this.focus = this.initialFocus;
    this.type = this.initialType;
    this.$refs.calendar.checkChange();
  },
  methods: {
    editShift(uuid) {
      const shift = this.visibleShifts.find(shift => shift.uuid === uuid);
      this.shiftEntity = new Shift(shift);
    },
    newShift() {
      this.shiftEntity = new Shift();
    },
    handleEventClick({ nativeEvent, event }) {
      this.eventClicks++;
      this.showEvent({ nativeEvent, event });
      if (this.eventClicks === 1) {
        this.timer = setTimeout(() => {
          this.eventClicks = 0;
        }, this.doubleClickDelay);
      } else {
        clearTimeout(this.doubleClickTimer);
        this.eventClicks = 0;
        this.$router.push({
          name: "editShift",
          params: { uuid: event.uuid }
        });
      }
    },
    intervalFormat(interval) {
      return interval.time;
    },
    colorMap(event) {
      return SHIFT_TYPE_COLORS[event.type.value];
    },
    confirmDelete(uuid) {
      this.dialog = true;
      this.uuid = uuid;
    },
    async destroy() {
      ShiftService.delete(this.uuid)
        .then(() => {
          const remainingShifts = this.shifts.filter(
            shift => shift.uuid !== this.uuid
          );

          this.$store.dispatch("shift/setShifts", remainingShifts);
        })
        .catch(handleApiError)
        .finally(() => {
          this.dialog = false;
          this.uuid = null;
        });
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
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
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;

      // Tell parent component the range updated
      this.$emit("updateRange", { type: this.type, start });
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    }
  }
};
</script>
