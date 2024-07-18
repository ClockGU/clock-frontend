<script setup>

import { mdiDelete } from "@mdi/js";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import ClockModel from "@/models/ClockModel";
import { Shift } from "@/models/ShiftModel";
import { formatDate, secondsToHHMM } from "@/utils/time";
import { useI18n } from "vue-i18n";

const { t } = useI18n(); // use as global scope
const clock = ref(undefined);

const duration = computed(()=> clock.value.duration)

const store = useStore();

const status = ref("idle");

function setStatusRunning() {
  status.value = "running";
}

function setStatusSaving() {
  status.value = "saving";
}

function setStatusIdle() {
  status.value = "idle"
}

function initializetClock() {
  clock.value = new ClockModel({startDate: new Date()});
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

async function clockIn() {
  setStatusSaving();
  try {
    initializetClock();
    clock.value.start();

  } catch (error) {
    store.dispatch("snackbar/setSnack", {
      message: error,
      color: "error"
    });
    setStatusIdle();
  }
  try {
    //creating clockedInShift
    const date = new Date();
    const shift = new Shift({
      started: date,
      contract: store.getters["selectedContract/selectedContract"].id
    });
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
  setStatusRunning()
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
        {{
          status === "running"
            ? t("dashboard.clock.state.running")
            : t("dashboard.clock.state.idle")
        }}
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
            {{ t("models.contract") }}: {{ store.getters["selectedContract/selectedContract"].name }}
          </div>
          <div class="font-weight-light">
            {{ formatDate(clock.startDate) }}
          </div>
          <div class="text-h6 font-weight-light text-center">
            {{ secondsToHHMM(duration) }}
          </div>
        </div>
      </v-row>
      <div class="justify-center mt-3">
        <v-slide-x-transition group leave-absolute>
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
            v-else-if="
              status === 'running' || status === 'saving'
            "
            key="clock-out"
            :disabled="status === 'saving'"
            color="primary"
            block
            variant="text"
          >
            {{ t("dashboard.clock.out") }}
          </v-btn>
        </v-slide-x-transition>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>