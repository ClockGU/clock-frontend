<template>
  <v-card>
    <v-window v-model="step">
      <v-window-item key="1">
        <v-card flat>
          <v-card-title>
            {{ $t("dashboard.progress.title.monthly") }}
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
                <p v-if="carryoverExceeded" class="text-right font-italic">
                  {{ $tc("dashboard.progress.maxCarryoverHint", maxCarryover) }}
                </p>
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
          </v-card-title>
          <v-card-text class="text-center">
            <p>{{ $t("dashboard.progress.dailyText1") }}</p>
            <span :class="dailyData < 480 ? '' : 'red--text'">
              <span class="text-h2">{{ dailyWorktime[0] }}</span>
              h
              <span class="text-h2">{{ dailyWorktime[1] }}</span>
              m
            </span>
            <p class="pt-4">{{ $t("dashboard.progress.dailyText2") }}</p>
            <p v-if="dailyData > 480" class="text-center font-italic">
              {{ $t("dashboard.progress.overtimeHint") }}
            </p>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

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
            <v-icon>{{ icons.mdiRecord }}</v-icon>
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
import { mdiRecord, mdiChevronLeft, mdiChevronRight } from "@mdi/js";

export default {
  name: "Progress",
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
    step: 0,
    length: 3,
    icons: { mdiChevronLeft, mdiChevronRight, mdiRecord }
  }),
  computed: {
    monthlyProgress() {
      console.log(this.azkData);
      return (100 * this.totalMinutesWorked) / this.totalMinutesPerMonth;
    },
    carryoverExceeded() {
      return this.monthlyProgress > 150;
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
      return this.weeklyprogress < 100 ? "primary" : "warning";
    },
    dailyWorktime() {
      return minutesToHHMM(this.dailyData).split(":");
    },
    totalMinutesPerMonth() {
      const [debitHours, debitMinutes] = this.azkData[1].value.split(":");

      return parseInt(debitHours) * 60 + parseInt(debitMinutes);
    },
    totalMinutesWorked() {
      const [creditHours, creditMinutes] = this.azkData[2].value.split(":");
      return parseInt(creditHours) * 60 + parseInt(creditMinutes);
    },
    maxCarryover() {
      return minutesToHHMM(0.5 * this.totalMinutesPerMonth);
    }
  },
  methods: {
    printProgress(progress) {
      return progress.toFixed(0);
    },
    carryoverClass(index) {
      return this.carryoverExceeded && index == 3 ? "red--text" : "";
    }
  }
};
</script>
