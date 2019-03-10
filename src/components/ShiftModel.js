import { mapFields } from "vuex-map-fields";

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
      this.shifts.find(shift => shift.uuid === this.uuid) || this.initialize();
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
      return {
        started: new Date().toISOString().substr(0, 10),
        time: "10:00",
        started2: new Date().toISOString().substr(0, 10),
        time2: "10:30",
        contract: null
      };
    },
    create() {
      console.log("ASD");
      this.$store.dispatch("addShift", this.shift);
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
