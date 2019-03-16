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
    this.shift =
      this.shifts.find(shift => shift.uuid === this.uuid) || new Shift();
  },
  computed: {
    ...mapFields(["shifts"]),
    index() {
      return this.shifts.findIndex(shift => shift.uuid === this.uuid);
    },
    remainingShifts() {
      return this.shifts.filter(shift => shift.uuid !== this.uuid);
    }
  },
  methods: {
    initialize() {
      return new Shift();
    },
    create() {
      console.log("Adding new shift.");
      this.shifts = [this.shift, ...this.shifts];
    },
    update() {
      this.shifts[this.index] = this.shift;
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
