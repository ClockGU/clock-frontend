<template>
  <v-layout row>
    <v-flex xs4 md5>
      <shift-form-date-input v-model="date" :shift="shift" :type="type" />
    </v-flex>
    <v-flex xs2 offset-xs4 md3 offset-md1>
      <shift-form-time-input v-model="date" :shift="shift" :type="type" />
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
    value: {
      type: Object,
      required: true
    },
    shift: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    date: {
      get() {
        return this.value[this.type];
      },
      set(date) {
        this.$emit("input", { ...this.value, [this.type]: date });
      }
    }
  }
};
</script>
