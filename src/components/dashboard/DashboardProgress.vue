<template>
  <v-card>
    <v-window v-model="step">
      <v-window-item key="1">
        <v-card flat>
          <v-card-title>
            {{ $t("dashboard.progress.title.monthly") }}
            <v-spacer></v-spacer>
            <v-btn
              v-if="maxCarryoverExceeded || carryover"
              icon
              color="warning"
              @click="showWarning('carryover')"
            >
              <v-icon>{{ icons.mdiInformation }}</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row align="center" justify="space-around">
              <v-col cols="2" align="center">
                <v-progress-circular
                  :color="colorMonthly"
                  size="64"
                  width="6"
                  rotate="270"
                  class="pa-2"
                  :value="monthlyProgress"
                >
                  {{ printProgress(monthlyProgress) }}%
                </v-progress-circular>
              </v-col>
              <v-col cols="9">
                <v-simple-table>
                  <template #default>
                    <tbody>
                      <tr
                        v-for="(row, index) in azkData"
                        :key="row.name"
                        :class="carryoverClass(index)"
                      >
                        <td>
                          {{ row.name }}
                        </td>
                        <td align="right">
                          {{ row.value }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item key="2">
        <v-card flat>
          <v-card-title>
            {{ $t("dashboard.progress.title.weekly") }}
          </v-card-title>
          <v-card-text>
            <v-row align="center" justify="space-around">
              <v-col cols="2" align="center">
                <v-progress-circular
                  :color="colorWeekly"
                  size="64"
                  width="6"
                  rotate="270"
                  class="pa-2"
                  :value="weeklyProgress"
                >
                  {{ printProgress(weeklyProgress) }}%
                </v-progress-circular>
              </v-col>
              <v-col cols="9">
                <p>
                  {{ $tc("dashboard.progress.weeklyText", weeklyHours) }}
                </p>
                <p>
                  {{ $tc("dashboard.progress.weeklyBase", weeklyAvg) }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item key="3">
        <v-card flat>
          <v-card-title>
            {{ $t("dashboard.progress.title.daily") }}
            <v-spacer></v-spacer>
            <v-btn
              v-if="dailyOvertime"
              icon
              color="warning"
              @click="showWarning('daily')"
            >
              <v-icon>{{ icons.mdiInformation }}</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="text-center">
            <p>{{ $t("dashboard.progress.dailyText1") }}</p>
            <span :class="colorDaily">
              <span class="text-h2">{{ dailyWorktime[0] }}</span>
              h
              <span class="text-h2">{{ dailyWorktime[1] }}</span>
              m
            </span>
            <p class="pt-4">{{ $t("dashboard.progress.dailyText2") }}</p>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <ShiftWarnings
      v-if="dialog"
      :warnings="warnings"
      @close="dialog = false"
    ></ShiftWarnings>

    <v-card-actions class="justify-space-between">
      <v-btn text @click="step == 0 ? (step = 2) : step--">
        <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
      </v-btn>
      <v-item-group v-model="step" class="text-center" mandatory>
        <v-item
          v-for="n in length"
          :key="`btn-${n}`"
          v-slot="{ active, toggle }"
        >
          <v-btn :input-value="active" icon @click="toggle">
            <v-icon>{{ icons.mdiCircleMedium }}</v-icon>
          </v-btn>
        </v-item>
      </v-item-group>
      <v-btn text @click="step == 2 ? (step = 0) : step++">
        <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { minutesToHHMM } from "@/utils/time";
import ShiftWarnings from "@/components/shifts/ShiftWarnings";
import {
  mdiRecord,
  mdiCircleMedium,
  mdiChevronLeft,
  mdiChevronRight,
  mdiInformation,
  mdiAlert
} from "@mdi/js";

export default {
  name: "DashboardProgress",
  components: { ShiftWarnings },
  props: {
    azkData: {
      type: Array,
      required: true
    },
    weeklyData: {
      type: Object,
      required: true
    },
    dailyData: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    step: 0,
    length: 3,
    warnings: [],
    icons: {
      mdiChevronLeft,
      mdiChevronRight,
      mdiRecord,
      mdiCircleMedium,
      mdiInformation,
      mdiAlert
    }
  }),
  computed: {
    totalMinutesWorked() {
      const [creditHours, creditMinutes] = this.azkData[2].value.split(":");
      return parseInt(creditHours) * 60 + parseInt(creditMinutes);
    },
    totalMinutesPerMonth() {
      const [debitHours, debitMinutes] = this.azkData[1].value.split(":");
      return parseInt(debitHours) * 60 + parseInt(debitMinutes);
    },
    monthlyProgress() {
      return (100 * this.totalMinutesWorked) / this.totalMinutesPerMonth;
    },
    colorMonthly() {
      if (this.monthlyProgress > 150) return "error";
      else if (this.monthlyProgress > 100) return "warning";
      else return "primary";
    },
    weeklyProgress() {
      return (100 * this.weeklyData.worktime) / this.weeklyData.avg;
    },
    weeklyHours() {
      return minutesToHHMM(this.weeklyData.worktime);
    },
    weeklyAvg() {
      return minutesToHHMM(this.weeklyData.avg);
    },
    colorWeekly() {
      return this.weeklyProgress <= 100 ? "primary" : "warning";
    },
    dailyWorktime() {
      return minutesToHHMM(this.dailyData).split(":");
    },
    maxCarryoverValue() {
      return minutesToHHMM(0.5 * this.totalMinutesPerMonth);
    },
    dailyOvertime() {
      return this.dailyData > 480;
    },
    colorDaily() {
      return this.dailyData > 480 ? "red--text" : "";
    },
    carryover() {
      return this.monthlyProgress > 100 && this.monthlyProgress < 150;
    },
    carryoverValue() {
      return minutesToHHMM(this.totalMinutesWorked - this.totalMinutesPerMonth);
    },
    maxCarryoverExceeded() {
      return this.monthlyProgress > 150;
    }
  },
  methods: {
    printProgress(progress) {
      return progress.toFixed(0);
    },
    carryoverClass(index) {
      // a bit hacky, but index is defined in this component
      if (index == 3) {
        if (this.carryover) return "orange--text";
        else if (this.maxCarryoverExceeded) return "red--text";
        else return "";
      }
    },
    showWarning(type) {
      // TODO: make this beautiful
      switch (type) {
        case "daily":
          this.warnings = [
            {
              warning: this.$tc(
                "dashboard.progress.warnings.dailyOvertime",
                this.dailyWorktime.join(":")
              )
            },
            {
              warning: this.$t("dashboard.progress.warnings.dailyOvertimeLegal")
            }
          ];
          break;
        case "carryover":
          this.warnings = [
            {
              warning: this.$tc(
                "dashboard.progress.warnings.carryover",
                this.carryoverValue
              )
            },
            {
              warning: this.$tc(
                "dashboard.progress.warnings.carryoverLegal",
                this.maxCarryoverValue
              )
            }
          ];
          break;
      }
      this.dialog = true;
    }
  }
};
</script>
