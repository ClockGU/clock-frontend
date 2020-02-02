import { parseISO } from "date-fns";
import is from "ramda/src/is";
import ClockModel from "@/models/ClockModel";
import { Shift } from "@/models/ShiftModel";
import { handleApiError } from "@/utils/interceptors";

export default {
  name: "ClockInOut",
  data: () => ({
    clock: null,
    reselectContract: null,
    saving: false
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
      if (this.clock === null || this.clock.duration === null) return 0;

      return this.clock.duration;
    },
    status() {
      if (this.saving) return "saving";
      if (this.clock === null) return "idle";
      if (this.clock.interval) return "running";
      if (this.clock.startDate && !this.clock.interval) return "paused";
    },
    startDate() {
      const date =
        this.clockedShift.started === undefined
          ? this.clockedShift.start
          : this.clockedShift.started;

      return is(Date, date) ? date : parseISO(date);
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

    this.stop();
  },
  methods: {
    save() {
      this.$store
        .dispatch("clock/GET_CLOCKED_SHIFT")
        .then(() => {
          const data = {
            date: {
              start: this.clockedShift.started,
              end: new Date()
            },
            contract: this.clockedShift.contract,
            type: { value: "st", text: "Shift" }
          };
          const shift = new Shift(data).toPayload();
          this.saving = true;
          this.pause();

          this.$store
            .dispatch("shift/CREATE_SHIFT", shift)
            .then(() => {
              this.reset(false);

              this.$store.dispatch("snackbar/setSnack", {
                snack: "Clocked out successfully.",
                timeout: 4000,
                color: "success"
              });
            })
            .catch(() => {
              this.unpause();
            })
            .finally(() => {
              this.saving = false;
            });
        })
        .catch(handleApiError);
    },
    start() {
      // If we retrieve a clockedShift from the API, start the local clock
      if (this.clockedShift !== null) {
        this.clock = new ClockModel({ startDate: this.startDate });
        this.clock.start();
        return;
      }

      this.$store
        .dispatch("clock/GET_CLOCKED_SHIFT")
        .then(() => {
          this.$store.dispatch("snackbar/setSnack", {
            snack: "You are already clocked in.",
            timeout: 4000,
            color: "warning"
          });
        })
        .catch(() => {
          // No shift is clocked in. Do the deed!
          const date = new Date();
          this.clock = new ClockModel({ startDate: date });
          const shift = {
            started: date,
            contract: this.contract.uuid
          };
          this.$store
            .dispatch("clock/CLOCK_SHIFT", { ...shift })
            .then(() => {
              this.clock.start();

              this.$store.dispatch("snackbar/setSnack", {
                snack: "Clocked in a new shift.",
                timeout: 4000,
                color: "success"
              });
            })
            .catch(handleApiError);
        });
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
    reset(snackbar = true) {
      this.$store
        .dispatch("clock/GET_CLOCKED_SHIFT")
        .then(() => {
          this.$store
            .dispatch("clock/DELETE_CLOCKED_SHIFT")
            .then(() => {
              this.stop();
            })
            .catch(() => {
              this.clock.resetInterval();
              this.clock = null;
            })
            .finally(() => {
              this.$store.dispatch("clock/UNCLOCK_SHIFT");

              if (snackbar) {
                this.$store.dispatch("snackbar/setSnack", {
                  snack: "Deleted clocked shift.",
                  timeout: 4000,
                  color: "success"
                });
              }
            });
        })
        .catch(() => {
          this.$store.dispatch("snackbar/setSnack", {
            snack: "You were already clocked out.",
            timeout: 4000,
            color: "warning"
          });
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
      start: this.start,
      data:
        this.clock === null
          ? {}
          : { startDate: this.clock.startDate, duration: this.duration },
      pause: this.pause,
      unpause: this.unpause,
      duration: this.duration,
      save: this.save,
      status: this.status,
      reselectContract: this.reselectContract
    });
  }
};
