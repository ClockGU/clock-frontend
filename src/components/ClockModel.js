import { differenceInSeconds } from "date-fns";
import uuid from "uuid/v4";
import { createHelpers } from "vuex-map-fields";

import { Shift } from "@/models/ShiftModel";

const { mapFields } = createHelpers({
  getterType: "shift/getField",
  mutationType: "shift/updateField"
});

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
      default: null
    }
  },
  computed: {
    ...mapFields(["shifts"]),
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
  methods: {
    initialize() {
      this.interval = null;
      this.shift = { start: null, contract: null };
      this.duration = null;
    },
    start(date) {
      this.shift.start = date;
      this.tick();
      this.interval = setInterval(() => this.tick(), 1000);
    },
    stop() {
      clearInterval(this.interval);
      console.log(this.contract);

      const data = {
        date: {
          start: this.shift.start,
          end: new Date()
        },
        uuid: uuid(),
        contract: this.shift.contract
      };
      const shift = new Shift(data);
      console.log(shift);

      this.shifts = [...this.shifts, shift];

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
      toggle: this.toggle,
      data: this.shift,
      duration: this.duration
    });
  }
};
