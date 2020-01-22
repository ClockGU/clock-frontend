<template>
  <v-row>
    <v-col>
      <v-sheet>
        <v-toolbar flat color="white">
          <v-btn
            outlined
            class="mr-4"
            data-cy="calendar-today"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn fab text small data-cy="calendar-previous-month" @click="prev">
            <v-icon small>{{ icons.mdiChevronLeft }}</v-icon>
          </v-btn>
          <v-btn fab text small data-cy="calendar-next-month" @click="next">
            <v-icon small>{{ icons.mdiChevronRight }}</v-icon>
          </v-btn>
          <v-toolbar-title data-cy="calendar-title">
            {{ title }}
          </v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined data-cy="calendar-type-select-button" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>{{ icons.mdiArrowDown }}</v-icon>
              </v-btn>
            </template>
            <v-list data-cy="calendar-type-select">
              <v-list-item
                data-cy="calendar-type-select-day"
                @click="type = 'day'"
              >
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item
                data-cy="calendar-type-select-week"
                @click="type = 'week'"
              >
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item
                data-cy="calendar-type-select-month"
                @click="type = 'month'"
              >
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item
                data-cy="calendar-type-select-4days"
                @click="type = '4day'"
              >
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <slot />
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
                :to="{
                  name: 'editShift',
                  params: { uuid: selectedEvent.uuid }
                }"
                :disabled="selectedEvent.exported"
                data-cy="calendar-selected-event-edit"
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
      </v-sheet>
    </v-col>

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
  </v-row>
</template>

<script>
import { format, parseISO } from "date-fns";
import { mapState } from "vuex";

// import { getRouterProps } from "@/utils/date";

import { Shift } from "@/models/ShiftModel";
import { Contract } from "@/models/ContractModel";
import ShiftService from "@/services/shift";

import TheDialog from "@/components/TheDialog";

import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiArrowDown,
  mdiClose
} from "@mdi/js";
import { handleApiError } from "../../utils/interceptors";

export default {
  name: "Calendar",
  components: {
    TheDialog
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
      mdiChevronLeft: mdiChevronLeft,
      mdiChevronRight: mdiChevronRight,
      mdiArrowDown: mdiArrowDown,
      mdiClose: mdiClose
    },
    dialog: false,
    today: format(new Date(), "yyyy-MM-dd"),
    focus: null,
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    eventClicks: 0,
    doubleClickTimer: null,
    doubleClickDelay: 500
  }),
  computed: {
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
      if (event.type.value === "st") return "primary lighten-2";
      if (event.type.value === "sk") return "grey";
      if (event.type.value === "vn") return "green lighten-1";

      return "red";
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
      // this.$store.dispatch("calendar/setType", "day");
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
