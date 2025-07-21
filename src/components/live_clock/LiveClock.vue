<script setup>
import { computed, ref, defineModel } from "vue";
import ClockModel from "@/models/ClockModel";
import { Shift } from "@/models/ShiftModel";
import { formatDate, secondsToHHMM } from "@/utils/time";
import {
  differenceInSeconds,
  getHours,
  getMinutes,
  isSameDay,
  set
} from "date-fns";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useShiftValidation } from "@/composable/useShiftValidation";
import { mdiDelete } from "@mdi/js";
import { ShiftService } from "@/services/models";

const { t } = useI18n(); // use as global scope
const window = defineModel("window", { type: Number });
const shiftToModify = defineModel("shiftToModify", {
  type: [Shift, typeof undefined]
});

const clock = ref(undefined);

const duration = computed(() => secondsToHHMM(clock.value.duration));
const clockedInShift = computed(() => store.getters["clock/clockedShift"]);
const store = useStore();
const status = ref("idle");

function setStatusRunning() {
  status.value = "running";
}

function setStatusSaving() {
  status.value = "saving";
}

function setStatusIdle() {
  status.value = "idle";
}

function initializeClock(startDate = null) {
  clock.value = new ClockModel({
    startDate: startDate ? startDate : new Date()
  });
}
async function destroy() {
  setStatusSaving();
  clock.value.pause();
  try {
    await store.dispatch("clock/deleteClockedShift");
    await store.dispatch("snackbar/setSnack", {
      message: t("dashboard.clock.snacks.deleted"),
      color: "success"
    });
  } catch (error) {
    if (error.response && error.response.status === 401) return;
    store.dispatch("snackbar/setSnack", {
      message: error,
      color: "error"
    });
    clock.value.start();
    setStatusRunning();
  }
  clock.value = undefined;
  setStatusIdle();
}

async function saveShift(startDate, endDate) {
  startDate.setSeconds(0, 0);
  endDate.setSeconds(0, 0);
  const shiftData = {
    started: startDate,
    stopped: endDate,
    contract: clockedInShift.value.contract,
    type: "st",
    wasReviewed: true
  };
  const shift = new Shift(shiftData);
  try {
    const savedShift = await ShiftService.create(shift.toPayload());
  } catch (error) {
    error.response.config.data = shiftData;
    throw error;
  }
  await store.commit("contentData/addShift", {
    contractID: shift.contract,
    shiftInstance: shift
  });
  await store.dispatch("snackbar/setSnack", {
    message: t("dashboard.clock.snacks.clockOut"),
    color: "success"
  });
  return shiftData;
}

async function clockIn() {
  setStatusSaving();
  try {
    initializeClock();
    clock.value.start();
  } catch (error) {
    store.dispatch("snackbar/setSnack", {
      message: error,
      color: "error"
    });
    clock.value.stop();
    setStatusIdle();
    return;
  }
  const started = new Date();
  const shift = new Shift({
    started,
    contract: store.getters["selectedContract/selectedContract"].id
  });
  const { alertMessages, errorMessages } = useShiftValidation(shift, true);

  if (errorMessages.value.length > 0) {
    await store.dispatch("snackbar/setSnack", {
      message: errorMessages.value[0],
      color: "error"
    });
    clock.value.stop();
    setStatusIdle();
    return;
  }
  if (alertMessages.value.length > 0) {
    await store.dispatch("snackbar/setSnack", {
      message: alertMessages.value[0],
      color: "warning"
    });
  }

  try {
    await store.dispatch("clock/clockShift", shift.toPayload());
  } catch (error) {
    if (error.response && error.response.status === 401) return;
    await store.dispatch("snackbar/setSnack", {
      message: error,
      color: "error"
    });
    clock.value.stop();
    setStatusIdle();
    return;
  }
  setStatusRunning();
}

async function clockOut() {
  setStatusSaving();
  clock.value.pause();
  const started = clockedInShift.value.started;
  // Catch Bug if saving at exactly 00:00 -> leads to zero duration shift.
  let clockOutDate = new Date();
  if (getHours(clockOutDate) === 0 && getMinutes(clockOutDate) === 0) {
    clockOutDate = set(clockedShift.started, {
      hours: 23,
      minutes: 59,
      seconds: 59
    });
  }
  // Not allowing shifts shorter than a minute
  if (differenceInSeconds(clockOutDate, started) < 60) {
    await destroy();
    store.dispatch("snackbar/setSnack", {
      message: t("dashboard.clock.snacks.shiftTooShort"),
      color: "warning"
    });
    return;
  }
  try {
    await saveShift(started, clockOutDate);
  } catch (error) {
    if (!error.response) return;
    if (error.response.status === 401) return;
    let shiftData = new Shift(error.response.config.data);
    if (error.response.status === 400) {
      if (!isSameDay(shiftData.started, shiftData.stopped)) {
        shiftData.stopped = set(clockedInShift.value.started, {
          hours: 23,
          minutes: 59,
          seconds: 59
        });
      }
      //TODO: Implement model-values for window and shiftToModify
      shiftToModify.value = new Shift(shiftData);
      window.value++;
    }
  } finally {
    clock.value.stop();
    clock.value = undefined;
    setStatusIdle();
    await store.dispatch("clock/deleteClockedShift");
    await store.dispatch("clock/unclockShift");
  }
}

//New way of created hook

if (clockedInShift.value !== undefined) {
  initializeClock(clockedInShift.value.started);
  clock.value.start();
  setStatusRunning();
}
</script>

<template>
  <v-card
    v-bind="$attrs"
    :disabled="status === 'saving'"
    :loading="status === 'saving'"
  >
    <v-toolbar :elevation="0">
      <v-toolbar-title>
        <h2>
          {{
            status === "running"
              ? t("dashboard.clock.state.running")
              : t("dashboard.clock.state.idle")
          }}
        </h2>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-scale-transition>
          <v-btn
            v-if="status === 'running' || status === 'saving'"
            variant="plain"
            @click="destroy"
          >
            <v-icon>{{ mdiDelete }}</v-icon>
          </v-btn>
        </v-scale-transition>
      </v-toolbar-items>
    </v-toolbar>

    <v-card-text>
      <v-row justify="center">
        <span
          v-if="status !== 'running' && status !== 'saving'"
          class="text-h6 font-weight-light"
        >
          {{ t("dashboard.clock.start") }}
        </span>
        <div v-else class="d-flex flex-column">
          <div class="font-weight-bold">
            {{ t("models.contract") }}:
            {{ store.getters["selectedContract/selectedContract"].name }}
          </div>
          <div class="font-weight-light">
            {{ formatDate(clock.startDate) }}
          </div>
          <div class="text-h6 font-weight-light text-center">
            {{ duration }}
          </div>
        </div>
      </v-row>
      <div class="justify-center mt-3">
        <v-btn
          v-if="status === 'idle'"
          key="clock-in"
          :disabled="status === 'saving'"
          color="primary"
          block
          @click="clockIn"
        >
          {{ t("dashboard.clock.in") }}
        </v-btn>
        <v-btn
          v-else-if="status === 'running' || status === 'saving'"
          key="clock-out"
          :disabled="status === 'saving'"
          color="primary"
          block
          variant="text"
          @click="clockOut"
        >
          {{ t("dashboard.clock.out") }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
