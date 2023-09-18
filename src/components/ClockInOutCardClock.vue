<template>
  <v-card
    v-bind="$attrs"
    :disabled="actions.status === 'saving'"
    :loading="actions.status === 'saving'"
  >
    <v-toolbar :elevation="0">
      <v-toolbar-title>
        {{
          actions.status === "running"
            ? $t("dashboard.clock.state.running")
            : $t("dashboard.clock.state.idle")
        }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-scale-transition>
          <v-btn
            v-if="actions.status === 'running' || actions.status === 'saving'"
            icon
            @click="actions.destroy"
          >
            <v-icon>{{ icons.mdiDelete }}</v-icon>
          </v-btn>
        </v-scale-transition>
      </v-toolbar-items>
    </v-toolbar>

    <v-card-text>
      <v-row justify="center">
        <span
          v-if="actions.status !== 'running' && actions.status !== 'saving'"
          class="text-h6 font-weight-light"
        >
          {{ $t("dashboard.clock.start") }}
        </span>
        <div v-else class="d-flex flex-column">
          <div class="font-weight-bold">
            {{ $tc("models.contract") }}: {{ contractName }}
          </div>
          <div class="font-weight-light">
            {{ actions.data.startDate | formatDate }}
          </div>
          <div class="text-h6 font-weight-light text-center">
            {{ actions.duration | toHHMM }}
          </div>
        </div>
      </v-row>
      <div class="justify-center mt-3">
        <v-slide-x-transition group leave-absolute>
          <v-btn
            v-if="actions.duration === 0 && actions.status === 'idle'"
            key="clock-in"
            :disabled="actions.status === 'saving'"
            color="primary"
            block
            @click="actions.start"
          >
            {{ $t("dashboard.clock.in") }}
          </v-btn>
          <v-btn
            v-else-if="
              actions.status === 'running' || actions.status === 'saving'
            "
            key="clock-out"
            :disabled="actions.status === 'saving'"
            color="primary"
            block
            variant="text"
            @click="saveFn"
          >
            {{ $t("dashboard.clock.out") }}
          </v-btn>
        </v-slide-x-transition>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { addSeconds, isSameDay } from "date-fns";
import { mdiDelete, mdiInformation } from "@mdi/js";

import { localizedFormat } from "@/utils/date";

export default {
  name: "ClockInOutCardClock",
  filters: {
    formatDate(date) {
      if (date === undefined) return "";
      return localizedFormat(date, "EEEE',' do' 'MMMM' 'yyyy '-' HH':'mm");
    },
    toTime(seconds) {
      let string = "";

      const date = addSeconds(new Date(1970, 1, 1), seconds);
      const days = Math.floor(seconds / (60 * 60 * 24));
      const hours = localizedFormat(date, "HH");
      const minutes = localizedFormat(date, "mm");
      const sec = localizedFormat(date, "ss");

      if (days > 0) {
        string += `${days}d `;
      }
      string += `${hours}h `;
      string += `${minutes}m `;
      string += `${sec}s`;

      if (string === "") return "00 secs";

      return string;
    },
    toHHMM(seconds) {
      let string = "";
      const date = addSeconds(new Date(1970, 1, 1), seconds);
      const hours = Math.floor(seconds / (60 * 60));
      const minutes = localizedFormat(date, "mm");
      const sec = localizedFormat(date, "ss");

      string += `${hours}:${minutes}:${sec}`;

      return string;
    }
  },
  inheritAttrs: false,
  props: {
    actions: {
      type: Object,
      required: true
    },
    saveFn: {
      type: Function,
      default: () => {}
    },
    contractName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      icons: { mdiDelete, mdiInformation }
    };
  },
  computed: {
    overflowedShift() {
      const today = new Date();
      return !isSameDay(today, this.actions.data.startDate);
    }
  }
};
</script>
