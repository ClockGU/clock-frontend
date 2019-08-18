<template>
  <v-sheet height="88vh" width="100vw">
    <v-calendar
      ref="calendar"
      color="primary"
      :show-month-on-first="false"
      :locale="locale"
      :type="type"
      :start="start"
      :end="end"
      :weekdays="weekdays"
      @click:date="changeDate"
    >
      <template v-slot:day="{ date }">
        <template v-for="event in eventsMap[date]">
          <v-menu :key="event.uuid" v-model="event.open" full-width offset-x>
            <template v-slot:activator="{ on }">
              <div v-if="!event.time" v-ripple class="my-event" v-on="on">
                {{ event.duration }}
              </div>
            </template>
            <ShiftModel :uuid="event.uuid">
              <template v-slot="{ duration, destroy }">
                <v-card color="grey lighten-4" min-width="350px" text>
                  <v-toolbar color="primary" dark text>
                    <v-btn
                      icon
                      :to="{
                        name: 'editShift',
                        params: { uuid: event.uuid }
                      }"
                      @click.native="event.open != event.open"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <span>{{ event.contract.name }}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.native="destroy()">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card-title primary-title>
                    <CalendarEvent :event="event"></CalendarEvent>
                  </v-card-title>
                  <!-- <v-card-actions>
                          <v-btn text color="secondary">Cancel</v-btn>
                  </v-card-actions>-->
                </v-card>
              </template>
            </ShiftModel>
          </v-menu>
        </template>
      </template>
    </v-calendar>
  </v-sheet>
</template>

<script>
import { format } from "date-fns";
import { mapState } from "vuex";

import { getRouterProps } from "@/utils/date";

import { Shift } from "@/models/Shifts";
import ShiftModel from "@/components/shifts/ShiftModel";
import CalendarEvent from "@/components/calendar/CalendarEvent";

export default {
  name: "Calendar",
  components: {
    CalendarEvent,
    ShiftModel
  },
  props: {
    start: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data: () => ({
    end: "2019-01-06",
    weekdays: [1, 2, 3, 4, 5, 6, 0]
  }),
  computed: {
    eventsMap() {
      const map = {};
      this.events.forEach(e =>
        (map[format(e.date, "YYYY-MM-DD")] =
          map[format(e.date, "YYYY-MM-DD")] || []).push(e)
      );
      return map;
    },
    events() {
      return this.shifts.map(item => {
        const shift = new Shift(item);
        const contract = this.contracts.find(
          contract => contract.uuid === shift.contract
        );

        return {
          title: "ABC",
          details: "dsa",
          uuid: shift.uuid,
          dates: shift.date,
          date: format(shift.date.start, "YYYY-MM-DD"),
          open: false,
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
    changeDate(payload) {
      const date = new Date(payload.date);
      const props = getRouterProps("day", date);
      this.$router.push({
        name: "calendar",
        params: props
      });

      this.$store.dispatch("calendar/setDate", date);
      this.$store.dispatch("calendar/setType", "day");
    }
  }
};
</script>

<style scoped>
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  width: 100%;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
}
</style>
