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
                  color="primary"
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
                      <tr v-for="row in azkData" :key="row.name">
                        <td>{{ row.name }}</td>
                        <td align="right">{{ row.value }}</td>
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
                  color="primary"
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
            <span class="text-h2">{{ dailyProgress }}</span>
            h
            <p>{{ $t("dashboard.progress.dailyText2") }}</p>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <v-card-actions class="justify-space-between">
      <v-btn :disabled="step == 0" text @click="step--">
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
      <v-btn :disabled="step == 2" text @click="step++">
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
      return (100 * this.totalMinutesWorked) / this.totalMinutesPerMonth;
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
    dailyProgress() {
      return minutesToHHMM(this.dailyData);
    },
    totalMinutesPerMonth() {
      const [debitHours, debitMinutes] = this.azkData[1].value.split(":");

      return parseInt(debitHours) * 60 + parseInt(debitMinutes);
    },
    totalMinutesWorked() {
      const [creditHours, creditMinutes] = this.azkData[2].value.split(":");

      return parseInt(creditHours) * 60 + parseInt(creditMinutes);
    }
  },
  methods: {
    printProgress(progress) {
      if (progress > 100) {
        return `>100`;
      }

      return progress.toFixed(0);
    }
  }
};
</script>
