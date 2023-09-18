<template>
  <v-row>
    <v-col cols="12">
      <v-select
        v-model="selected"
        :items="frequency"
        item-title="text"
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
          :min="currentDateString"
          :max="contractEndDateString"
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
import { RRule } from "rrule";

import ShiftFormRepeatDialog from "@/components/shifts/ShiftFormRepeatDialog.vue";
import { formatISO, parseISO } from "date-fns";

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
    shift: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      repeatUntil: "contractDate",
      menu: false,
      selected: "WEEKLY",
      customEnd: undefined,
      interval: 1
    };
  },
  computed: {
    shifts() {
      return this.generatedSchedule
        .map((startDate) => {
          const endDate = new Date(this.shift.stopped);
          endDate.setDate(startDate.getDate());
          endDate.setMonth(startDate.getMonth());
          endDate.setYear(startDate.getFullYear());
          let shift = this.shift.clone();
          startDate.setHours(this.shift.started.getHours());
          shift.started = startDate;
          shift.stopped = endDate;
          shift.wasReviewed = false;
          return shift;
        })
        .slice(1);
    },
    currentDate() {
      return this.shift.started;
    },
    contractEndDate() {
      return this.$store.getters["contentData/contractById"](
        this.shift.contract
      ).endDate;
    },
    currentDateString() {
      return formatISO(this.currentDate, { representation: "date" });
    },
    contractEndDateString() {
      return formatISO(this.contractEndDate, { representation: "date" });
    },
    isDatePickerDisabled() {
      return this.repeatUntil === "contractDate";
    },
    repeatUntilDate() {
      const OPTIONS = {
        contractDate: this.contractEndDate,
        customDate: parseISO(this.customEnd + "T23:59:59")
      };
      return OPTIONS[this.repeatUntil];
    },
    endDate() {
      return localizedFormat(this.repeatUntilDate, "EEEE',' do MMMM yyyy");
    },
    frequency() {
      const dayOfMonth = localizedFormat(this.currentDate, "do");
      const weekdayName = localizedFormat(this.currentDate, "EEEE");

      return [
        {
          text: this.$t("shifts.repeating.frequencies.weekdays"),
          value: "WEEKDAYS"
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
        MONTHLY: this.monthlySchedule,
        WEEKDAYS: this.weekdaySchedule,
        WEEKLY: this.weeklySchedule
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
      return {
        freq: FREQUENCY["DAILY"],
        byweekday: [
          ALL_DAYS[1],
          ALL_DAYS[2],
          ALL_DAYS[3],
          ALL_DAYS[4],
          ALL_DAYS[5]
        ]
      };
    },
    generatedSchedule() {
      const rule = new RRule({
        ...this.schedules[this.selected],
        interval: this.interval,
        dtstart: this.shift.started,
        until: this.repeatUntilDate
      });
      return rule.all();
    }
  },
  watch: {
    shifts() {
      this.$emit("input", this.shifts);
    }
  },
  created() {
    this.customEnd = this.contractEndDateString;
  }
};
</script>
