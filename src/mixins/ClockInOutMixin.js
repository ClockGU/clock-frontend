import { differenceInSeconds, getHours, getMinutes, set } from "date-fns";
import ClockModel from "@/models/ClockModel";
import { Shift } from "@/models/ShiftModel";
import { log } from "@/utils/log";
import { mapGetters } from "vuex";
import { ShiftService } from "@/services/models";

export default {
  name: "ClockInOutMixin",
  data: () => ({
    clock: null,
    reselectContract: null,
    saving: false,
    shiftData: {}
  }),
  computed: {
    ...mapGetters({
      clockedShift: "clock/clockedShift"
    }),
    clockData() {
      if (this.clock === null) return {};

      return { startDate: this.clock.startDate, duration: this.duration };
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
    if (this.clockedShift === undefined) return;
    this.clock = new ClockModel({
      startDate: this.clockedShift.started
    });
    this.clock.start();
  },
  destroyed() {
    this.stop();
  },
  methods: {
    async save() {
      this.saving = true;
      try {
        this.pause();

        const startDate = this.clockedShift.started;

        // clocking out at exactly 00:00 would generate a zero-length shift
        // set the shift's end to 23:59:59 on the day the shift was clocked in
        let clockOutDate = new Date();
        if (getHours(clockOutDate) === 0 && getMinutes(clockOutDate) === 0) {
          clockOutDate = set(this.clockedShift.started, {
            hours: 23,
            minutes: 59,
            seconds: 59
          });
        }

        const endDate = clockOutDate;
        // Do not accept live clocked shifts shorter than a minute
        if (differenceInSeconds(endDate, startDate) < 60) {
          await this.$store.dispatch("clock/deleteClockedShift");
          await this.$store.dispatch("clock/unclockShift");
          this.stop();
          this.$store.dispatch("snackbar/setSnack", {
            snack: this.$t("dashboard.clock.snacks.shiftTooShort"),
            timeout: 4000,
            color: "warning"
          });
        } else {
          this.shiftData = {
            started: startDate,
            stopped: endDate,
            contract: this.clockedShift.contract,
            type: "st",
            wasReviewed: true
          };
          const payload = new Shift(this.shiftData).toPayload();
          const savedShift = await ShiftService.create(payload);
          await this.$store.commit("contentData/addShift", {
            contractID: savedShift.contract,
            shiftInstance: savedShift
          });
          await this.$store.dispatch("clock/deleteClockedShift");
          this.$store.dispatch("clock/unclockShift");

          this.$store.dispatch("snackbar/setSnack", {
            snack: this.$t("dashboard.clock.snacks.clockOut"),
            timeout: 4000,
            color: "success"
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 401) return;
        if (error.response && error.response.status === 400) {
          this.shiftToModify = new Shift(this.shiftData);
          this.window += 1;
          this.unpause();
          return;
        }
        await this.reset();
      } finally {
        this.saving = false;
        this.shiftData = {};
      }
    },
    async start() {
      this.saving = true;
      try {
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
        const shift = new Shift({
          started: date,
          contract: this.$store.getters["selectedContract/selectedContract"].id
        });

        await this.$store.dispatch("clock/clockShift", shift);
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
        this.$store.commit("clock/unclockShift");
      }
    },
    async reset(snackbar = true) {
      this.pause();
      this.saving = true;
      try {
        await this.$store.dispatch("clock/deleteClockedShift");
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
      this.$store.dispatch("clock/unclockShift");

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