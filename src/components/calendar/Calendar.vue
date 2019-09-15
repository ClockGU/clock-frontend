<template>
  <v-row>
    <v-col>
      <v-sheet>
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" @click="setToday">Today</v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>chevron_left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>chevron_right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>arrow_drop_down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
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
          @click:event="showEvent"
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
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon @click="selectedOpen = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Type: {{ selectedEvent.type }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <h2 class="title primary-text">
                {{ selectedEvent.duration }} on
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
              >
                Edit
              </v-btn>
              <v-btn text @click="confirmDelete(selectedEvent.uuid)">
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>

    <TheDialog v-if="dialog" @close="dialog = false">
      <template v-slot:content>
        <v-card>
          <v-card-title class="headline"
            >You sure you want to delete this shift?</v-card-title
          >
          <v-card-text>
            <p>
              This action is not reversible.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" text @click="destroy">Delete</v-btn>
            <v-btn text @click="dialog = false">Cancel</v-btn>
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
import ShiftService from "@/services/shift.service.js";

import TheDialog from "@/components/TheDialog";

export default {
  name: "Calendar",
  components: {
    TheDialog
  },
  filters: {
    formatDate(date, formatString = "Do MMMM yyyy") {
      if (date === undefined) return;
      return format(parseISO(date), formatString);
    },
    formatTime(date, formatString = "HH:mm a") {
      if (date === undefined) return;
      return format(parseISO(date), formatString);
    }
  },
  data: () => ({
    dialog: false,
    today: format(new Date(), "yyyy-MM-dd"),
    focus: format(new Date(), "yyyy-MM-dd"),
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
    selectedOpen: false
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

        return {
          uuid: shift.uuid,
          start: format(shift.date.start, "yyyy-MM-dd HH:mm"),
          end: format(shift.date.end, "yyyy-MM-dd HH:mm"),
          type: shift.type.text,
          color: this.colorMap(shift),
          duration: shift.representationalDuration,
          contract: contract
        };
      });
    },
    ...mapState({
      contracts: state => state.contract.contracts,
      locale: state => state.calendar.locale,
      shifts: state => state.shift.shifts
    })
  },
  methods: {
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
        .catch(error => {
          this.$store.dispatch("snackbar/setSnack", {
            snack: error.message,
            timeout: 0,
            color: "error"
          });
        })
        .finally(() => {
          this.dialog = false;
          this.uuid = null;
        });
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
      this.$store.dispatch("calendar/setType", "day");
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
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start;
      this.end = end.date;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    }
  }
};
</script>
