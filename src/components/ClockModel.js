import { differenceInSeconds } from "date-fns";
import uuid from "uuid/v4";

import { Shift } from "@/models/ShiftModel";
import ShiftService from "@/services/shift.service";

export default {
  name: "ClockModel",
  data: () => ({
    duration: null,
    interval: null,
    shift: {
      start: null,
      contract: null
    }
  }),
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  computed: {
    clockData() {
      return {
        started: this.shift.start,
        duration: this.duration
      };
    }
  },
  mounted() {
    // Do nothing if no initialStart value was provided.
    if (!this.startDate) return;

    this.start(this.startDate);
  },
  destroyed() {
    this.clear();
  },
  methods: {
    clear() {
      clearInterval(this.interval);
    },
    initialize() {
      this.interval = null;
      this.shift = { start: null, contract: null };
      this.duration = null;
      this.$store.dispatch("shift/clearClockedShift");
    },
    start(date, contract) {
      this.shift.start = date;
      this.shift.contract = contract;
      this.startTick();

      this.$store.dispatch("shift/clockShift", this.shift);
    },
    reset() {
      this.clear();
      this.initialize();
    },
    startTick() {
      this.tick();
      this.interval = setInterval(() => this.tick(), 1000);
    },
    async stop() {
      this.clear();

      const data = {
        date: {
          start: this.shift.start,
          end: new Date()
        },
        uuid: uuid(),
        contract: this.$store.state.selectedContract.uuid,
        type: { value: "st", text: "Shift" }
      };
      const payload = new Shift(data).toPayload();

      await ShiftService.create(payload);
      this.initialize();
    },
    tick() {
      this.duration = differenceInSeconds(new Date(), this.shift.start);
    },
    toggle() {
      this.shift.start ? this.stop() : this.start(new Date());
    }
  },
  render() {
    return this.$scopedSlots.default({
      start: this.start,
      stop: this.stop,
      reset: this.reset,
      toggle: this.toggle,
      data: this.shift,
      pause: this.clear,
      unpause: this.startTick,
      duration: this.duration
    });
  }
};
