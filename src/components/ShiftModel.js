import { format, parse } from "date-fns";
import { Shift } from "@/models/Shifts";
import { createHelpers } from "vuex-map-fields";

const { mapFields } = createHelpers({
  getterType: "shift/getField",
  mutationType: "shift/updateField"
});

export default {
  name: "ShiftModel",
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  data: () => ({
    shift: null
  }),
  created() {
    const shift =
      this.shifts.find(shift => shift.uuid === this.uuid) || new Shift();

    this.shift = {
      started: {
        date: format(shift._start, "YYYY-MM-DD"),
        time: format(shift._start, "HH:mm")
      },
      finished: {
        date: format(shift._end, "YYYY-MM-DD"),
        time: format(shift._end, "HH:mm")
      },
      ...shift
    };
  },
  computed: {
    ...mapFields(["shifts"]),
    index() {
      return this.shifts.findIndex(shift => shift.uuid === this.uuid);
    },
    remainingShifts() {
      return this.shifts.filter(shift => shift.uuid !== this.uuid);
    },
    payload() {
      const shift = this.shift;
      shift._start = parse(
        `${shift.started.time} ${shift.started.date}`,
        "HH:mm YYYY-MM-DD"
      );
      shift._end = parse(
        `${shift.finished.time} ${shift.finished.date}`,
        "HH:mm YYYY-MM-DD"
      );

      delete shift.started;
      delete shift.finished;

      return shift;
    }
  },
  methods: {
    initialize() {
      return new Shift();
    },
    create() {
      console.log("Adding new shift.");
      this.shifts = [this.payload, ...this.shifts];
      // this.$store.dispatch("shift/addShift", this.shift);
    },
    update() {
      this.shifts[this.index] = this.payload;
    },
    destroy() {
      this.shifts = this.remainingShifts;
    }
  },
  render() {
    return this.$scopedSlots.default({
      create: this.create,
      data: this.shift,
      destroy: this.destroy,
      update: this.update
    });
  }
};
