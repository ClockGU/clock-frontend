<template>
  <v-row>
    <v-col>
      <v-sheet width="90vw">
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
      <v-sheet height="600" width="90vw">
        <slot />
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
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
          full-width
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn
                icon
                :to="{
                  name: 'editShift',
                  params: { uuid: selectedEvent.uuid }
                }"
              >
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn icon @click="confirmDelete(selectedEvent.uuid)">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false"
                >Dismiss</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>

    <TheDialog v-if="dialog">
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
            <div class="flex-grow-1"></div>
            <v-btn text @click="dialog = false">Cancel</v-btn>
            <v-btn color="error" text @click="destroy">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </TheDialog>
  </v-row>
</template>

<script>
import { format } from "date-fns";
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
  data: () => ({
    dialog: false,
    today: format(new Date(), "YYYY-MM-DD"),
    focus: format(new Date(), "YYYY-MM-DD"),
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
          name: shift.representationalDuration,
          details: "These are details",
          uuid: shift.uuid,
          // date: format(shift.date.start, "YYYY-MM-DD"),
          start: format(shift.date.start, "YYYY-MM-DD HH:mm"),
          end: format(shift.date.end, "YYYY-MM-DD HH:mm"),
          // open: false,
          color: "indigo",
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
    confirmDelete(uuid) {
      this.dialog = true;
      this.uuid = uuid;
    },
    async destroy() {
      await ShiftService.delete(this.uuid);
      const remainingShifts = this.shifts.filter(
        shift => shift.uuid !== this.uuid
      );

      this.$store.dispatch("shift/setShifts", remainingShifts);

      if (this.dialog) {
        this.dialog = false;
      }
    },
    // changeDate(payload) {
    //   const date = new Date(payload.date);
    //   const props = getRouterProps("day", date);
    //   this.$router.push({
    //     name: "calendar",
    //     params: props
    //   });

    //   this.$store.dispatch("calendar/setDate", date);
    //   this.$store.dispatch("calendar/setType", "day");
    // },
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
