import { differenceInSeconds, isDate, parseISO } from "date-fns";
import uuid from "uuid/v4";

import { Shift } from "@/models/ShiftModel";
import ShiftService from "@/services/shift";
import ClockService from "@/services/clock";

export default {
  name: "ClockModel",
  data: () => ({
    interval: null,
    shift: {
      start: null,
      contract: null
    },
    now: null
  }),
  props: {
    clockedShift: {
      type: Object || null,
      default: null
    },
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
    },
    duration() {
      if (!isDate(this.now)) return 0;

      return differenceInSeconds(new Date(), this.shift.start);
    }
  },
  watch: {
    startDate() {
      this.startClock();
    }
  },
  mounted() {
    this.startClock();
  },
  destroyed() {
    this.clear();
  },
  methods: {
    clear() {
      clearInterval(this.interval);
    },
    startClock() {
      // Do nothing if no initialStart value was provided.
      if (!this.startDate) return;

      this.start(
        this.startDate,
        this.$store.state.selectedContract.uuid,
        false
      );
    },
    initialize() {
      this.interval = null;
      this.shift = { start: null, contract: null };
      this.now = null;
      this.$store.dispatch("shift/clearClockedShift");
    },
    async start(date, contract, create = true) {
      this.shift.start = date;
      this.shift.contract = contract;
      this.startTick();

      if (create === true) {
        const response = await ClockService.create({
          ...this.shift,
          started: this.shift.start
        });
        this.shift.start = parseISO(response.date.start);
        this.shift.contract = response.contract;
        this.shift.id = response.uuid;
      } else {
        this.shift.id = this.clockedShift.id;
      }
      this.$store.dispatch("shift/clockShift", this.shift);
    },
    async reset() {
      await ClockService.delete(this.shift.id);

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

      await ClockService.delete(this.shift.id);
      const payload = new Shift(data).toPayload();

      await ShiftService.create(payload);
      this.initialize();
    },
    tick() {
      this.now = new Date();
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
