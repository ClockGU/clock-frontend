<template>
  <v-row>
    <v-col cols="12">
      <v-select
        v-model="selected"
        :items="frequency"
        item-text="text"
        item-value="value"
        hide-details
        :label="$t('shifts.repeating.frequencyLabel')"
      ></v-select>
    </v-col>

    <v-col cols="12" sm="6" align-self="center">
      <v-radio-group v-model="repeatUntil" hide-details>
        <template #label>
          <div>{{ $t("shifts.repeating.repeatUntil.title") }}</div>
        </template>
        <v-radio value="contractDate">
          <template #label>
            <div>{{ $t("shifts.repeating.repeatUntil.contractDate") }}</div>
          </template>
        </v-radio>
        <v-radio value="customDate">
          <template #label>
            <div>
              {{ $t("shifts.repeating.repeatUntil.customDate") }}
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </v-col>

    <v-col cols="12" sm="5" offset-sm="1" align-self="end">
      <v-menu
        ref="menu"
        v-model="menu"
        :disabled="isDatePickerDisabled"
        :close-on-content-click="true"
        transition="scale-transition"
        hide-details
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="endDate"
            :disabled="isDatePickerDisabled"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="customEnd"
          no-title
          first-day-of-week="1"
          :min="date"
          :max="contractEndDate"
        />
      </v-menu>
    </v-col>

    <v-col cols="12">
      <v-slider
        v-model="interval"
        step="1"
        min="1"
        max="30"
        thumb-label
        ticks
        persistent-hint
        :label="$t('shifts.repeating.interval.label', { number: interval })"
        :hint="
          $tc('shifts.repeating.interval.hint', shifts.length, {
            number: shifts.length
          })
        "
      />
    </v-col>

    <v-col cols="12">
      <ShiftFormRepeatDialog :shifts="shifts" />
    </v-col>
  </v-row>
</template>

<script>
import { localizedFormat } from "@/utils/date";
import { parseISO } from "date-fns";
import { RRule } from "rrule";
import { Shift } from "@/models/ShiftModel";
import { v4 as uuidv4 } from "uuid";

import ShiftFormRepeatDialog from "@/components/shifts/ShiftFormRepeatDialog";

const ALL_DAYS = {
  0: RRule.SU,
  1: RRule.MO,
  2: RRule.TU,
  3: RRule.WE,
  4: RRule.TH,
  5: RRule.FR,
  6: RRule.SA
};

const FREQUENCY = {
  DAILY: RRule.DAILY,
  WEEKLY: RRule.WEEKLY,
  MONTHLY: RRule.MONTHLY
};

export default {
  name: "ShiftFormRepeat",
  components: { ShiftFormRepeatDialog },
  props: {
    contractEndDate: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    shift: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    repeatUntil: "contractDate",
    menu: false,
    selected: "WEEKLY",
    customEnd: null,
    interval: 1
    // icons: { mdiRepeat }
  }),
  computed: {
    shifts() {
      return this.generatedSchedule
        .map((startDate) => {
          const endDate = new Date(this.shift.date.end);
          endDate.setDate(startDate.getDate());
          endDate.setMonth(startDate.getMonth());

          return new Shift({
            ...this.shift,
            date: { start: startDate, end: endDate },
            uuid: uuidv4(),
            reviewed: false
          });
        })
        .slice(1);
    },
    isDatePickerDisabled() {
      return this.repeatUntil === "contractDate";
    },
    repeatUntilDate() {
      const OPTIONS = {
        contractDate: this.contractEndDate,
        customDate: this.customEnd
      };

      return OPTIONS[this.repeatUntil];
    },
    endDate() {
      return localizedFormat(
        parseISO(this.repeatUntilDate),
        "EEEE',' do MMMM yyyy"
      );
    },
    frequency() {
      const dayOfMonth = localizedFormat(parseISO(this.date), "do");
      const weekdayName = localizedFormat(parseISO(this.date), "EEEE");

      return [
        { text: this.$t("shifts.repeating.frequencies.daily"), value: "DAILY" },
        {
          text: this.$t("shifts.repeating.frequencies.weekdays"),
          value: "WEEKDAYS"
        },
        {
          text: this.$t("shifts.repeating.frequencies.weekends"),
          value: "WEEKENDS"
        },
        {
          text: this.$t("shifts.repeating.frequencies.weekly", {
            weekday: weekdayName
          }),
          value: "WEEKLY"
        },
        {
          text: this.$t("shifts.repeating.frequencies.monthly", {
            dayOfMonth: dayOfMonth
          }),
          value: "MONTHLY"
        }
      ];
    },
    schedules() {
      return {
        DAILY: this.dailySchedule,
        MONTHLY: this.monthlySchedule,
        WEEKDAYS: this.weekdaySchedule,
        WEEKENDS: this.weekendSchedule,
        WEEKLY: this.weeklySchedule
      };
    },
    dailySchedule() {
      return {
        freq: FREQUENCY["DAILY"]
      };
    },
    monthlySchedule() {
      return {
        freq: FREQUENCY["MONTHLY"]
      };
    },
    weeklySchedule() {
      return {
        freq: FREQUENCY["WEEKLY"]
      };
    },
    weekdaySchedule() {
      const weekdays = Object.values(ALL_DAYS).slice(1, 6);

      return {
        ...this.dailySchedule,
        byweekday: weekdays
      };
    },
    weekendSchedule() {
      const weekend = [ALL_DAYS[0], ALL_DAYS[6]];

      return {
        ...this.dailySchedule,
        byweekday: weekend
      };
    },
    generatedSchedule() {
      const rule = new RRule({
        ...this.schedules[this.selected],
        interval: this.interval,
        dtstart: this.shift.date.start,
        until: parseISO(this.repeatUntilDate)
      });

      return rule.all();
    }
  },
  watch: {
    shifts() {
      this.$emit("update", this.shifts);
    }
  },
  created() {
    this.customEnd = this.contractEndDate;
  }
};
</script>
