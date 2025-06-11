<template>
  <v-row class="mt-3">
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
        :close-on-content-click="false"
        transition="scale-transition"
        hide-details
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template #activator="{ props }">
          <v-text-field
            v-model="endDate"
            :disabled="isDatePickerDisabled"
            readonly
            v-bind="props"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="customEnd"
          no-title
          first-day-of-week="1"
          :min="currentDateString"
          :max="contractEndDateString"
          @click:save="menu = false"
          @click:cancel="menu = false"
          @update:model-value="menu = false"
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
        show-ticks="always"
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
import { datetime, RRule } from "rrule";
import { clone } from "rrule/dist/esm/dateutil";

import ShiftFormRepeatDialog from "@/components/shifts/ShiftFormRepeatDialog.vue";
import { endOfMonth, formatISO } from "date-fns";

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
    modelValue: {
      type: Array,
      required: false,
      default: () => []
    },
    shift: {
      type: Object,
      required: true
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      repeatUntil: "contractDate",
      menu: false,
      selected: "WEEKLY",
      customEnd: new Date(),
      date: new Date(),
      interval: 1
    };
  },
  computed: {
    shifts() {
      return this.generatedSchedule
        .map((startDateString) => {
          let startDate = startDateString;
          const endDate = clone(startDate);
          endDate.setHours(this.shift.stopped.getHours());
          endDate.setMinutes(this.shift.stopped.getMinutes());
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
      if (!this.shift.contract) {
        return endOfMonth(this.currentDate);
      }
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
      this.customEnd.setHours(23, 59, 59);
      const OPTIONS = {
        contractDate: this.contractEndDate,
        customDate: this.customEnd
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
      const mapper = (val) => {
        return [
          val.getFullYear(),
          val.getMonth(),
          val.getDate(),
          val.getHours(),
          val.getMinutes()
        ];
      };
      const dtstart = datetime(...mapper(this.shift.started));
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
      this.$emit("update:modelValue", this.shifts);
    }
  },
  created() {
    this.customEnd = this.contractEndDate;
  }
};
</script>
