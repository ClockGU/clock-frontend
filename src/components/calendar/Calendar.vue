<template>
  <v-container class="pb-0" style="height: 100%">
    <v-sheet>
      <v-container>
        <v-row
          align="center"
          justify="space-between"
          height="100px"
          flat
          color="white"
        >
          <v-col class="px-0" cols="12">
            <SelectContractFilter :disabled="disabled" :contracts="contracts" />
          </v-col>
          <v-col class="px-0" cols="12">
            <v-btn :disabled="disabled" color="primary" @click="newShift">
              {{ $t("buttons.newEntity", { entity: $tc("models.shift") }) }}
            </v-btn>
          </v-col>

          <v-col class="px-0" cols="12" sm="5">
            <CalendarNavigationButtons
              @today="setToday"
              @next="next"
              @prev="prev"
            />
          </v-col>

          <v-col class="px-0" cols="12" sm="3" order-sm="3">
            <CalendarTypeSelect v-model="type" />
          </v-col>

          <v-col
            v-if="$refs.calendar"
            class="px-0"
            cols="12"
            sm="4"
            order-sm="2"
          >
            <span data-cy="calendar-title">
              {{ $refs.calendar.title }}
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
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
        @click:event="editShift"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="updateRange"
      ></v-calendar>

      <FormDialog
        v-if="showFormDialog"
        entity-name="shift"
        :entity="shiftEntity"
        :now="shiftNow"
        @close="closeFormDialog"
        @refresh="refresh"
      />
    </v-sheet>
  </v-container>
</template>

<script>
import { formatTime, formatDate } from "@/utils/time";
import { SHIFT_TYPE_COLORS } from "@/utils/colors";
import { Shift } from "@/models/ShiftModel";
import { Contract } from "@/models/ContractModel";
import { getNextContractParams } from "@/utils";

import FormDialog from "@/components/FormDialog";
import CalendarNavigationButtons from "@/components/calendar/CalendarNavigationButtons";
import CalendarTypeSelect from "@/components/calendar/CalendarTypeSelect";
import SelectContractFilter from "@/components/SelectContractFilter";

import { localizedFormat } from "@/utils/date";
import { mdiClose, mdiPlus } from "@mdi/js";
import { mapState } from "vuex";

export default {
  name: "Calendar",
  components: {
    CalendarNavigationButtons,
    CalendarTypeSelect,
    FormDialog,
    SelectContractFilter
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
    shiftEntity: null,
    showFormDialog: false
  }),
  computed: {
    selectedContract() {
      const uuid = this.$route.params.contract;
      if (this.disabled) {
        return { uuid: null, date: { start: "2019-01-01", end: "2019-01-31" } };
      }
      return this.contracts.find((contract) => contract.uuid === uuid);
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
        (shift) => shift.contract === this.selectedContract.uuid
      );
    },
    events() {
      return this.visibleShifts.map((item) => {
        const shift = new Shift(item);
        const contract = new Contract(
          this.contracts.find((contract) => contract.id === shift.contract)
        );

        const duration =
          this.type === "month"
            ? "- " + shift.representationalDuration()
            : shift.representationalDuration();

        return {
          uuid: shift.uuid,
          start: localizedFormat(shift.date.start, "yyyy-MM-dd HH:mm"),
          end: localizedFormat(shift.date.end, "yyyy-MM-dd HH:mm"),
          type: shift.type.value,
          color: this.colorMap(shift),
          duration: duration,
          selectedEventDuration: shift.representationalDuration(),
          reviewed: shift.reviewed,
          contract: contract,
          locked: shift.locked
        };
      });
    },
    ...mapState({
      contracts: (state) => state.contract.contracts,
      locale: (state) => state.locale,
      shifts: (state) => state.shift.shifts
    })
  },
  async mounted() {
    this.$refs.calendar.checkChange();
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

      this.$emit("refresh");
    },
    editShift({ event }) {
      const shift = this.visibleShifts.find(
        (shift) => shift.uuid === event.uuid
      );
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
    intervalFormat(interval) {
      return interval.time;
    },
    colorMap(event) {
      return SHIFT_TYPE_COLORS[event.type.value];
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
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;

      const [year, month, day] = localizedFormat(
        this.shiftNow,
        "yyyy-MM-dd"
      ).split("-");

      // Tell parent component the range updated
      this.$emit("updateRange", {
        type: this.type,
        start: { day, month, year }
      });
    }
  }
};
</script>
