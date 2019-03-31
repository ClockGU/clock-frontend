import { differenceInSeconds } from "date-fns";
import uuid from "uuid/v4";
import { createHelpers } from "vuex-map-fields";

import { Shift } from "@/models/Shifts";

const { mapFields } = createHelpers({
  getterType: "shift/getField",
  mutationType: "shift/updateField"
});

export default {
  name: "Clock",
  data: () => ({
    duration: null,
    interval: null,
    started: null
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
        started: this.started,
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
      this.started = null;
      this.duration = null;
    },
    start(date) {
      this.started = date;
      this.tick();
      this.interval = setInterval(() => this.tick(), 1000);
    },
    stop() {
      clearInterval(this.interval);

      const data = {
        date: {
          start: this.started,
          end: new Date()
        },
        uuid: uuid()
      };
      const shift = new Shift(data);

      this.shifts = [...this.shifts, shift];

      this.initialize();
    },
    tick() {
      this.duration = differenceInSeconds(new Date(), this.started);
    },
    toggle() {
      this.started ? this.stop() : this.start(new Date());
    }
  },
  render() {
    return this.$scopedSlots.default({
      start: this.start,
      stop: this.stop,
      toggle: this.toggle,
      data: this.clockData
    });
  }
};
