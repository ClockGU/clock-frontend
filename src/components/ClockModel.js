import { differenceInSeconds } from "date-fns";

export default {
  name: "Clock",
  data: () => ({
    interval: null,
    started: null,
    duration: null
  }),
  computed: {
    clockData() {
      return {
        started: this.started,
        duration: this.duration
      };
    }
  },
  methods: {
    initialize() {
      this.interval = null;
      this.started = null;
      this.duration = null;
    },
    tick() {
      this.duration = differenceInSeconds(new Date(), this.started);
    },
    start() {
      this.started = new Date();
      this.duration = 0;
      this.interval = setInterval(() => this.tick(), 1000);
    },
    stop() {
      clearInterval(this.interval);
      this.initialize();
    },
    toggle() {
      this.started ? this.stop() : this.start();
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
