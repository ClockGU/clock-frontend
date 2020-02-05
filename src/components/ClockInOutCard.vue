<template>
  <ClockInOut :clocked-shift="clockedShift">
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
            :actions="{ data, duration, status, start, pause, destroy, save }"
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

export default {
  name: "ClockInOutCard",
  components: {
    ClockInOut,
    ClockInOutCardClock,
    ClockInOutCardForm
  },
  props: {
    selectedContract: {
      type: Object || null,
      required: true
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
  }
};
</script>
