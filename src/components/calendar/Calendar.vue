<template>
  <div style="height: 100%">
    <v-sheet>
      <v-container>
        <v-row align="center" height="100px" flat color="white">
          <v-col cols="12">
            <SelectContractFilter
              :contracts="contracts"
              :selected-contract="selectedContract"
            />
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" @click="newShift">
              {{ $t("buttons.newEntity", { entity: $tc("models.shift") }) }}
            </v-btn>
          </v-col>

          <v-col cols="12" sm="5">
            <CalendarNavigationButtons
              @today="setToday"
              @next="next"
              @prev="prev"
            />
          </v-col>

          <v-col cols="12" sm="2" order-sm="3">
            <CalendarTypeSelect v-model="type" />
          </v-col>

          <v-col cols="12" sm="5" order-sm="2">
            <span data-cy="calendar-title">
              {{ title }}
            </span>
          </v-col>
        </v-row>
      </v-container>
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
              {{ $t("calendar.type") }}:
              {{
                $t(
                  `shifts.types.${
                    selectedEvent.type === undefined ? "st" : selectedEvent.type
                  }`
                )
              }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text data-cy="calendar-selected-event-text">
            <h2 class="title primary-text">
              {{
                $t("calendar.shiftOnDay", {
                  duration: selectedEvent.selectedEventDuration,
                  start: formatDate(selectedEvent.start)
                })
              }}
            </h2>
            {{
              $t("calendar.shiftFromTo", {
                start: formatTime(selectedEvent.start),
                end: formatTime(selectedEvent.end)
              })
            }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="primary"
              :disabled="selectedEvent.exported"
              data-cy="calendar-selected-event-edit"
              @click="editShift(selectedEvent.uuid)"
            >
              {{ $t("actions.edit") }}
            </v-btn>

            <ConfirmationDialog @confirm="destroy(selectedEvent.uuid)">
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  :disabled="selectedEvent.exported"
                  data-cy="calendar-selected-event-delete"
                  v-on="on"
                >
                  {{ $t("actions.delete") }}
                </v-btn>
              </template>

              <template v-slot:title>
                {{
                  $t("buttons.deleteEntity", { entity: $tc("models.shift") })
                }}
              </template>

              <template v-slot:text>
                {{
                  $t(`dialogs.textConfirmDelete`, {
                    selectedEntity: $tc(`models.selectedShift`)
                  })
                }}
              </template>
            </ConfirmationDialog>
          </v-card-actions>
        </v-card>
      </v-menu>

      <FormDialog
        v-if="showFormDialog"
        entity-name="shift"
        :entity="shiftEntity"
        :now="shiftNow"
        @close="closeFormDialog"
        @refresh="refresh"
      />
    </v-sheet>
  </div>
</template>

<script>
import { formatTime, formatDate } from "@/utils/time";
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { Shift } from "@/models/ShiftModel";
import { Contract } from "@/models/ContractModel";
import ShiftService from "@/services/shift";
import { handleApiError } from "@/utils/interceptors";
import { getNextContractParams } from "@/utils";

import FormDialog from "@/components/FormDialog";
import CalendarNavigationButtons from "@/components/calendar/CalendarNavigationButtons";
import CalendarTypeSelect from "@/components/calendar/CalendarTypeSelect";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import SelectContractFilter from "@/components/SelectContractFilter";

import { format } from "date-fns";
import { mdiClose, mdiPlus } from "@mdi/js";
import { mapState } from "vuex";

export default {
  name: "Calendar",
  components: {
    CalendarNavigationButtons,
    CalendarTypeSelect,
    ConfirmationDialog,
    FormDialog,
    SelectContractFilter
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
    shiftEntity: null,
    showFormDialog: false
  }),
  computed: {
    selectedContract() {
      const uuid = this.$route.params.contract;

      return this.contracts.find(contract => contract.uuid === uuid);
    },
    shiftNow() {
      const now = new Date();
      const [year, month, day] = this.focus.split("-");

      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        now.getHours(),
        now.getMinutes()
      );
    },
    visibleShifts() {
      if (this.selectedContract === null) return [];

      return this.shifts.filter(
        shift => shift.contract === this.selectedContract.uuid
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
          type: shift.type.value,
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
  async mounted() {
    this.$refs.calendar.checkChange();

    await this.$store.dispatch("shift/queryShifts");
    await this.$store.dispatch("contract/queryContracts");
  },
  created() {
    this.focus = this.initialFocus;
    this.type = this.initialType;
  },
  methods: {
    formatTime(value) {
      return formatTime(value);
    },
    formatDate(value) {
      return formatDate(value);
    },
    async refresh({ contract }) {
      if (this.$route.params.contract !== contract) {
        await this.$router.replace(
          getNextContractParams(this.$route, contract)
        );
      }
    },
    editShift(uuid) {
      const shift = this.visibleShifts.find(shift => shift.uuid === uuid);
      this.shiftEntity = new Shift(shift);
      this.showFormDialog = true;
    },
    newShift() {
      this.showFormDialog = true;
    },
    closeFormDialog() {
      this.showFormDialog = false;
      this.shiftEntity = null;
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
    async destroy(uuid) {
      this.selectedOpen = false;

      ShiftService.delete(uuid)
        .then(() => {
          const remainingShifts = this.shifts.filter(
            shift => shift.uuid !== uuid
          );

          this.$store.dispatch("shift/setShifts", remainingShifts);
        })
        .catch(handleApiError);
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

      const [year, month, day] = format(this.shiftNow, "yyyy-MM-dd").split("-");

      // Tell parent component the range updated
      this.$emit("updateRange", {
        type: this.type,
        start: { day, month, year }
      });
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    }
  }
};
</script>
