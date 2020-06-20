import { parseISO } from "date-fns";
import ClockModel from "@/models/ClockModel";
import { Shift } from "@/models/ShiftModel";
import { log } from "@/utils/log";

export default {
  name: "ClockInOut",
  data: () => ({
    clock: null,
    reselectContract: null,
    saving: false,
    clockedShift: null
  }),
  props: {
    selectedContract: {
      type: Object || null,
      required: true
    }
  },
  computed: {
    clockData() {
      if (this.clock === null) return {};

      return { startDate: this.clock.startDate, duration: this.duration };
    },
    contract() {
      return this.selectedContract;
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
    }
  },
  async created() {
    try {
      // Only start the clock if there is a clockedShift when mounting the component.
      this.clockedShift = await this.$store.dispatch("clock/GET_CLOCKED_SHIFT");
      this.clock = new ClockModel({
        startDate: parseISO(this.clockedShift.started)
      });
      this.clock.start();
    } catch (error) {
      // Do nothing if there is no clocked shift
      return;
    }
  },
  destroyed() {
    this.stop();
  },
  methods: {
    async save() {
      this.saving = true;
      try {
        this.pause();
        await this.$store.dispatch("clock/GET_CLOCKED_SHIFT");

        const startDate =
          this.clockedShift.date === undefined
            ? this.clockedShift.started
            : this.clockedShift.date.start;

        const data = {
          date: {
            start: startDate,
            end: new Date()
          },
          contract: this.clockedShift.contract,
          type: { value: "st", text: "Shift" }
        };

        const payload = new Shift(data).toPayload();

        await this.$store.dispatch("shift/CREATE_SHIFT", payload);
        await this.$store.dispatch("clock/DELETE_CLOCKED_SHIFT");
        this.$store.dispatch("clock/UNCLOCK_SHIFT");

        this.stop();

        this.$store.dispatch("snackbar/setSnack", {
          snack: this.$t("dashboard.clock.snacks.clockOut"),
          timeout: 4000,
          color: "success"
        });
      } catch (error) {
        if (error.response && error.response.status === 401) return;

        this.reset();
      }
      this.saving = false;
    },
    async start() {
      this.saving = true;
      try {
        this.clockedShift = await this.$store.dispatch(
          "clock/GET_CLOCKED_SHIFT"
        );
        this.clock = new ClockModel({ startDate: this.clockedShift.startDate });
        this.clock.start();
        this.$store.dispatch("snackbar/setSnack", {
          snack: this.$t("dashboard.clock.snacks.alreadyClockedIn"),
          timeout: 4000,
          color: "warning"
        });
      } catch (error) {
        if (error.response && error.response.status === 401) return;
        // No shift is clocked in. Do the deed!
        const date = new Date();
        this.clock = new ClockModel({ startDate: date });
        const shift = {
          started: date,
          contract: this.contract.uuid
        };

        this.clockedShift = await this.$store.dispatch("clock/CLOCK_SHIFT", {
          ...shift
        });
        this.clock.start();
        this.$store.dispatch("snackbar/setSnack", {
          snack: this.$t("dashboard.clock.snacks.clockedIn"),
          timeout: 4000,
          color: "success"
        });
      } finally {
        this.saving = false;
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
      try {
        this.clock.stop();
      } catch (error) {
        log("Tried to destroy clock, while it was already destroyed.");
      } finally {
        this.clock = null;
        this.clockedShift = null;
      }
    },
    async reset(snackbar = true) {
      this.pause();
      this.saving = true;
      try {
        await this.$store.dispatch("clock/GET_CLOCKED_SHIFT");
        await this.$store.dispatch("clock/DELETE_CLOCKED_SHIFT");
        this.stop();

        if (snackbar) {
          this.$store.dispatch("snackbar/setSnack", {
            snack: this.$t("dashboard.clock.snacks.deleted"),
            timeout: 4000,
            color: "success"
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 401) return;

        this.clock.resetInterval();
        this.clock = null;

        this.$store.dispatch("snackbar/setSnack", {
          snack: this.$t("dashboard.clock.snacks.alreadyClockedOut"),
          timeout: 4000,
          color: "warning"
        });
      }
      this.$store.dispatch("clock/UNCLOCK_SHIFT");

      this.saving = false;
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
      data: this.clockData,
      pause: this.pause,
      unpause: this.unpause,
      duration: this.duration,
      save: this.save,
      status: this.status,
      reselectContract: this.reselectContract
    });
  }
};
