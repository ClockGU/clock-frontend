<template>
  <ClockInOut
    :clocked-shift="clockedShift"
    :selected-contract="selectedContract"
  >
    <template
      v-slot="{
        data,
        duration,
        status,
        start,
        stop: pause,
        reset: destroy,
        save
      }"
    >
      <v-window v-model="window">
        <v-window-item :key="0">
          <ClockInOutCardClock
            :actions="{
              data,
              clockedContract,
              duration,
              status,
              start,
              pause,
              destroy,
              save
            }"
            @updateWindow="window += $event"
          />
        </v-window-item>

        <v-window-item v-if="clockedShift !== null" :key="1">
          <ClockInOutCardForm
            :clocked-shift="clockedShift"
            :destroy="destroy"
            @updateWindow="window += $event"
          />
        </v-window-item>
      </v-window>
    </template>
  </ClockInOut>
</template>

<script>
import ClockInOut from "@/components/ClockInOut";
import ClockInOutCardClock from "@/components/ClockInOutCardClock";
import ClockInOutCardForm from "@/components/ClockInOutCardForm";

import { mapGetters } from "vuex";

export default {
  name: "ClockInOutCard",
  components: {
    ClockInOut,
    ClockInOutCardClock,
    ClockInOutCardForm
  },
  props: {
    selectedContract: {
      required: true,
      validator: prop => typeof prop === "object" || prop === null
    },
    clockedShift: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      window: 0
    };
  },
  computed: {
    ...mapGetters({
      contracts: "contract/contracts"
    }),
    clockedContract() {
      if (this.clockedShift === null) return this.selectedContract;

      return this.contracts.find(
        contract => contract.uuid === this.clockedShift.contract
      );
    }
  }
};
</script>
