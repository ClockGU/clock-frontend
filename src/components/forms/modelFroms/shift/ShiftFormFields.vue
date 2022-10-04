<template>
  <v-card-text>
    <ShiftFormTags v-model="shift.tags" />
    <ShiftFormNote v-model="shift.note" />
  </v-card-text>
</template>

<script>
import { Shift } from "@/models/ShiftModel";
import ShiftFormNote from "@/components/shifts/ShiftFormNote";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";
export default {
  name: "ShiftFormFields",
  components: { ShiftFormTags, ShiftFormNote },
  props: {
    value: {
      type: Shift,
      required: true
    }
  },
  data() {
    return { shift: this.value };
  },
  watch: {
    value(val) {
      this.shift = val;
    },
    shift(value) {
      this.$emit("input", value);
    }
  }
};
</script>

<style scoped></style>
