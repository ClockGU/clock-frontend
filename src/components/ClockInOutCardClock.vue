<template>
  <v-card
    v-bind="$attrs"
    :disabled="actions.status === 'saving'"
    :loading="actions.status === 'saving'"
  >
    <v-overlay :value="showOverlay" absolute opacity="0.8">
      <v-row justify="center">
        <p>
          You are clocked into a different contract. To clock out, you need to
          select this contract.
        </p>
        <v-btn color="primary lighten-1" @click="changeContract">
          Change contract
        </v-btn>
      </v-row>
    </v-overlay>

    <v-toolbar :elevation="0">
      <v-toolbar-title>
        {{
          actions.status === "running" ? "Shift is running" : "No running shift"
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
          class="title font-weight-light"
        >
          Start a shift
        </span>
        <div v-else class="d-flex flex-column">
          <div class="font-weight-bold">
            Contract: {{ clockedContract.name }}
          </div>
          <div class="font-weight-light">
            {{ actions.data.startDate }}
          </div>
          <div class="title font-weight-light text-center">
            {{ actions.duration | toTime }}
          </div>
        </div>
      </v-row>
      <v-slide-x-transition group leave-absolute>
        <v-btn
          v-if="actions.duration === 0 && actions.status === 'idle'"
          key="clock-in"
          :disabled="actions.status === 'saving'"
          color="primary"
          block
          @click="actions.start"
        >
          Clock in
        </v-btn>
        <v-btn
          v-else-if="
            !overflowedShift &&
              (actions.status === 'running' || actions.status === 'saving')
          "
          key="clock-out"
          :disabled="actions.status === 'saving'"
          color="primary"
          block
          text
          @click="actions.save"
        >
          Clock out
        </v-btn>
        <v-btn
          v-else-if="
            overflowedShift &&
              (actions.status === 'running' || actions.status === 'saving')
          "
          key="review-problems"
          :disabled="actions.status === 'saving'"
          color="error"
          block
          text
          @click="$emit('updateWindow', 1)"
        >
          Review problems
        </v-btn>
      </v-slide-x-transition>
    </v-card-text>
  </v-card>
</template>

<script>
import { addSeconds, format, isSameDay } from "date-fns";
import { mdiDelete, mdiInformation } from "@mdi/js";

import { mapGetters } from "vuex";

export default {
  name: "ClockInOutCardClock",
  filters: {
    toTime(seconds) {
      let string = "";

      const date = addSeconds(new Date(1970, 1, 1), seconds);
      const days = Math.floor(seconds / (60 * 60 * 24));
      const hours = format(date, "HH");
      const minutes = format(date, "mm");
      const sec = format(date, "ss");

      if (days > 0) {
        string += `${days} days, `;
      }
      if (hours !== "00") {
        string += `${hours} hrs `;
      }
      if (minutes !== "00") {
        string += `${minutes} mins `;
      }
      if (sec !== "00") {
        string += `${sec} secs`;
      }

      if (string === "") return "00 secs";

      return string;
    }
  },
  inheritAttrs: false,
  props: {
    actions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      icons: { mdiDelete, mdiInformation }
    };
  },
  computed: {
    ...mapGetters({
      contracts: "contract/contracts"
    }),
    clockedContract() {
      return this.contracts.find(
        contract => contract.uuid === this.actions.clockedContract.uuid
      );
    },
    overflowedShift() {
      const today = new Date();
      return !isSameDay(today, this.actions.data.startDate);
    },
    showOverlay() {
      return this.$route.params.contract !== this.clockedContract.uuid;
    }
  },
  methods: {
    changeContract() {
      this.$router.push({
        ...this.$route,
        params: { ...this.$route.params, contract: this.clockedContract.uuid }
      });
    }
  }
};
</script>
