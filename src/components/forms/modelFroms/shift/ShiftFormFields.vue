<template>
  <v-card-text>
    <ShiftFormTags v-model="shift.tags" />
    <ShiftFormNote v-model="shift.note" />
    <ShiftFormType v-model="shift.type" />
    <ShiftFormSelectContract
      v-model="shift.contract"
      :choices="validContracts"
    />
  </v-card-text>
</template>

<script>
import { Shift } from "@/models/ShiftModel";
import ShiftFormNote from "@/components/shifts/ShiftFormNote";
import ShiftFormTags from "@/components/shifts/ShiftFormTags";
import ShiftFormType from "@/components/shifts/ShiftFormType";
import ShiftFormSelectContract from "@/components/shifts/ShiftFormSelectContract";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
export default {
  name: "ShiftFormFields",
  components: {
    ShiftFormTags,
    ShiftFormNote,
    ShiftFormType,
    ShiftFormSelectContract
  },
  props: {
    value: {
      type: Shift,
      required: true
    }
  },
  data() {
    return { shift: this.value };
  },
  computed: {
    validContracts() {
      console.log(this.shift);
      return this.$store.getters["contentData/allContracts"].filter(
        //TODO: Solve this with a mixin
        (contract) => {
          return isWithinInterval(this.shift.started, {
            start: startOfDay(contract.startDate),
            end: endOfDay(contract.endDate)
          });
        }
      );
    }
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
