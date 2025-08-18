<template>
  <v-card>
    <v-window v-model="step">
      <v-hover>
        <template #default="{ hover }">
          <div @click="toggleTouchOverlay(hover)">
            <v-window-item key="1">
              <v-card ref="primary-card" flat>
                <v-card-title>
                  <h2>
                    {{ $t("dashboard.progress.title.monthly") }}
                  </h2>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="maxCarryoverExceeded || carryover"
                    variant="flat"
                    :icon="
                      maxCarryoverExceeded
                        ? icons.mdiAlert
                        : icons.mdiInformation
                    "
                    :color="maxCarryoverExceeded ? 'error' : 'warning'"
                    :aria-label="$t('label.dashboard.infoButton')"
                    @click="showWarning('carryover')"
                  >
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
                        :model-value="disabled ? 0 : monthlyProgress"
                      >
                        {{ disabled ? 0 : printProgress(monthlyProgress) }}%
                      </v-progress-circular>
                    </v-col>
                    <v-col cols="9">
                      <v-table>
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
                      </v-table>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-window-item>

            <v-window-item key="2">
              <v-card
                flat
                :min-height="minCardHeight"
                class="grow d-flex flex-column flex-nowrap"
              >
                <v-card-title>
                  <h2>{{ $t("dashboard.progress.title.weekly") }}</h2>
                </v-card-title>
                <v-row justify="center" class="grow">
                  <v-col cols="12" align-self="center">
                    <v-card-text>
                      <v-row align-content="center">
                        <v-col cols="2" align-self="center">
                          <v-progress-circular
                            :color="colorWeekly"
                            size="64"
                            width="6"
                            rotate="270"
                            class="pa-2"
                            :model-value="disabled ? 0 : weeklyProgress"
                          >
                            {{ disabled ? 0 : printProgress(weeklyProgress) }}%
                          </v-progress-circular>
                        </v-col>
                        <v-col cols="9" align-self="center">
                          <p>
                            {{
                              $tc("dashboard.progress.weeklyText", [
                                weeklyHours
                              ])
                            }}
                          </p>
                          <p style="margin-bottom: 0">
                            {{
                              $t("dashboard.progress.weeklyBase", [weeklyAvg])
                            }}
                          </p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </v-window-item>

            <v-window-item key="3">
              <v-card
                flat
                :min-height="minCardHeight"
                class="grow d-flex flex-column flex-nowrap"
              >
                <v-card-title>
                  <h2>{{ $t("dashboard.progress.title.daily") }}</h2>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="dailyOvertime"
                    variant="flat"
                    :icon="icons.mdiAlert"
                    color="error"
                    :aria-label="$t('label.dashboard.dailyInfoButton')"
                    @click="showWarning('daily')"
                  ></v-btn>
                </v-card-title>
                <v-row justify="center" class="grow">
                  <v-col cols="12" align-self="center">
                    <v-card-text class="text-center">
                      <p>{{ $t("dashboard.progress.dailyText1") }}</p>
                      <span :class="colorDaily">
                        <span class="text-h2">{{ dailyWorktime[0] }}</span>
                        h
                        <span class="text-h2">{{ dailyWorktime[1] }}</span>
                        m
                      </span>
                      <p class="pt-4">
                        {{ $t("dashboard.progress.dailyText2") }}
                      </p>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </v-window-item>
            <v-fade-transition>
              <v-overlay
                v-if="disabled && (hover || touchOverlay)"
                absolute
                scrim="primary"
                style="align-items: start"
              >
                <p style="margin-top: 15%" class="text-center">
                  {{ $t("dashboard.disabled.progressHere") }}
                </p>
              </v-overlay>
            </v-fade-transition>
          </div>
        </template>
      </v-hover>
    </v-window>

    <ShiftWarnings
      v-if="dialog"
      :warnings="warnings"
      @close="dialog = false"
    ></ShiftWarnings>

    <v-card-actions class="justify-space-between">
      <v-btn
        variant="text"
        :aria-label="$t('label.dashboard.previousView')"
        @click="step === 0 ? (step = 2) : step--"
      >
        <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
      </v-btn>
      <v-item-group v-model="step" class="text-center" mandatory>
        <v-item
          v-for="n in length"
          :key="`btn-${n}`"
          v-slot="{ active, toggle }"
        >
          <v-btn
            :input-value="active"
            :icon="icons.mdiCircleMedium"
            :aria-label="
              $t(
                n === 1
                  ? 'label.dashboard.showMonthlyProgress'
                  : n === 2
                  ? 'label.dashboard.showWeeklyProgress'
                  : 'label.dashboard.showDailyProgress'
              )
            "
            @click="toggle"
          >
          </v-btn>
        </v-item>
      </v-item-group>
      <v-btn
        variant="text"
        :icon="icons.mdiChevronRight"
        :aria-label="$t('label.dashboard.nextView')"
        @click="step === 2 ? (step = 0) : step++"
      >
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { minutesToHHMM } from "@/utils/time";
import ShiftWarnings from "@/components/shifts/ShiftWarnings.vue";
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
    disabled: {
      type: Boolean,
      default: false
    },
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
    },
    minCardHeight: 0,
    touchOverlay: false
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
  async mounted() {
    this.minCardHeight = this.$refs["primary-card"].$el.clientHeight;
  },
  methods: {
    toggleTouchOverlay(hover) {
      this.touchOverlay = hover ? false : !this.touchOverlay;
    },
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
