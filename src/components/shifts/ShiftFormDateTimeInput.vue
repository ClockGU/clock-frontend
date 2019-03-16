<template>
  <v-layout row>
    <v-flex xs6>
      <shift-form-date-input :shift="shift" :type="type" />
    </v-flex>
    <v-flex xs6>
      <shift-form-time-input :shift="shift" :type="type" />
    </v-flex>
  </v-layout>
</template>

<script>
import ShiftFormTimeInput from "@/components/shifts/ShiftFormTimeInput";
import ShiftFormDateInput from "@/components/shifts/ShiftFormDateInput";

export default {
  name: "ShiftFormDateTimeInput",
  components: { ShiftFormTimeInput, ShiftFormDateInput },
  props: {
    shift: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }
};
</script>
