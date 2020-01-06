import { eachDayOfInterval, parseISO } from "date-fns";
import is from "ramda/src/is";
import ClockModel from "@/models/ClockModel";

export default {
  name: "ClockInOut",
  data: () => ({
    clock: null,
    reselectContract: null
  }),
  props: {
    clockedShift: {
      type: Object || null,
      default: null
    }
  },
  computed: {
    contract() {
      return this.$store.state.selectedContract;
    },
    duration() {
      if (this.clock === null) return 0;

      return this.clock.duration;
    },
    status() {
      if (this.clock === null) return "idle";
      if (this.clock.interval) return "running";
      if (this.clock.startDate && !this.clock.interval) return "paused";
    }
  },
  watch: {
    clockedShift: function(newValue, oldValue) {
      // We stopped or reset the clock. Make sure to cleanup everything.
      // This also takes care of some edge-case with the below code.
      if (newValue === null) {
        if (this.clock !== null) this.stop();
        return;
      }

      // We performed a query and retrieved a new clocked shift.
      // If a clock is already running, stop it.
      // And always start a new clock.
      const clockedInADifferentSession =
        newValue.override !== undefined && newValue.override;
      if (
        clockedInADifferentSession ||
        (oldValue !== null &&
          JSON.stringify(newValue) === JSON.stringify(oldValue))
      ) {
        if (this.clock !== null) this.stop();
        this.start();

        // Redirect to contract selection screen
        const clockedIntoDifferentContract =
          newValue.contract !== this.contract.uuid;
        const allowedRoutes = [
          "contractSelect",
          "createContract",
          "help",
          "changePassword",
          "debug"
        ];
        const currentRouteInAllowedRoutes =
          allowedRoutes.indexOf(this.$route.name) > -1;
        if (clockedIntoDifferentContract && !currentRouteInAllowedRoutes) {
          this.redirectToContractSelection();
        }
      }
    }
  },
  mounted() {
    // Do nothing if there is no clocked shift
    if (this.clockedShift === null) return;

    // Only start the clock if there is a clockedShift when mounting the component.
    this.start();
  },
  destroyed() {
    if (this.clock === null) return;

    this.clock.resetInterval();
    this.clock = null;
  },
  methods: {
    action() {
      const isNewShift = this.duration === 0;
      const isShortShift = this.duration < 600;
      const stopFn = () => {
        this.$store.dispatch("shift/CONVERT_CLOCKED_TO_NORMAL_SHIFT", {
          callback: () => this.stop(),
          errorCallback: () => {
            this.clock.resetInterval();
            this.clock = null;
          }
        });
      };

      // Starting a new shift
      if (isNewShift) {
        this.start();
        return;
      }

      // Trying to stop a short shift
      if (isShortShift) {
        this.pause();
        this.$emit("short", this.clock, {
          stop: stopFn,
          unpause: this.unpause,
          reset: this.reset
        });
        return;
      }

      // Trying to stop the shift, but it spans multiple days
      const start = is(Date, this.clockedShift.started)
        ? this.clockedShift.started
        : parseISO(this.clockedShift.started);
      const isOverflowedShift =
        eachDayOfInterval({
          start,
          end: new Date()
        }).length > 1;
      if (isOverflowedShift) {
        this.$emit("overflow", this.clock, { reset: this.reset });
        return;
      }

      // Stop the shift
      stopFn();
      return;
    },
    start() {
      const date =
        this.clockedShift === null
          ? new Date()
          : parseISO(this.clockedShift.started);
      this.clock = new ClockModel({ startDate: date });

      // Persists shift to API if it was not already retrieved from it.
      if (this.clockedShift === null) {
        const shift = {
          started: date,
          contract: this.contract.uuid
        };
        this.$store.dispatch("shift/CREATE_CLOCKED_SHIFT", {
          shift: shift,
          callback: () => this.clock.start()
        });
      } else {
        this.clock.start();
      }
    },
    unpause() {
      this.clock.start();
    },
    pause() {
      this.clock.pause();
    },
    toggle() {
      this.clock.toggle();
    },
    stop() {
      this.clock.stop();
      this.clock = null;
    },
    reset() {
      const uuid = this.$store.state.shift.clockedShift.id;

      this.$store
        .dispatch("shift/DELETE_CLOCKED_SHIFT", {
          uuid: uuid,
          callback: () => this.clock.stop(),
          errorCallback: () => {
            this.clock.resetInterval();
            this.clock = null;
          }
        })
        .then(() => {
          this.clock = null;
        });
    },
    redirectToContractSelection() {
      this.reselectContract = () => {
        this.$router.push({ name: "contractSelect" });
        this.reselectContract = null;
      };
    }
  },
  render() {
    return this.$scopedSlots.default({
      stop: this.stop,
      reset: this.reset,
      data:
        this.clock === null
          ? {}
          : { startDate: this.clock.startDate, duration: this.duration },
      pause: this.pause,
      unpause: this.unpause,
      duration: this.duration,
      action: this.action,
      status: this.status,
      reselectContract: this.reselectContract
    });
  }
};
