import { Shift } from "@/models/Shifts";
import { createHelpers } from "vuex-map-fields";
// import ShiftService from "@/services/shift.service";

import uuid from "uuid/v4";

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
      return this.shifts.filter(shift => shift.uuid != this.uuid);
    }
  },
  methods: {
    async create() {
      // const payload = this.shift.toPayload();
      // await ShiftService.create(payload);

      console.log("Adding new shift.");
      this.shift.uuid = uuid();
      // TODO: Using vuex-map-fields will actually put "this.shifts" as payload into the mutation. This might be a performance problem at some point. Also hitting a real API with this will probably not work..?
      this.shifts = [this.shift, ...this.shifts];
      this.shift = new Shift();
    },
    update() {
      console.log("Updating shift.");
      this.shifts[this.index] = this.shift;
    },
    destroy() {
      console.log("Deleting shift.");
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
