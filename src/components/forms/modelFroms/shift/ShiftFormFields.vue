<template>
  <v-card-text>
    <ShiftFormTags v-model="shift.tags" @input="handleInput" />
    <ShiftFormNote v-model="shift.note" @input="handleInput" />
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
  methods: {
    handleInput() {
      this.$emit("input", this.shift);
    }
  }
};
</script>

<style scoped></style>
