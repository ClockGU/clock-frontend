<template>
  <v-container>
    <v-layout wrap justify-center>
      <v-flex xs12 md8 lg10>
        <ShiftForm :uuid="uuid" :entity="entity" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ShiftForm from "@/components/shifts/ShiftForm";
import { Shift } from "@/models/ShiftModel";

export default {
  name: "CreateShift",
  components: { ShiftForm },
  props: {
    uuid: {
      type: String,
      default: null
    }
  },
  created() {
    const shifts = this.$store.state.shift.shifts;

    this.entity = new Shift(shifts.find(shift => shift.uuid === this.uuid));
  }
};
</script>
