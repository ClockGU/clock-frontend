<template>
  <v-icon v-if="alertMessages.length > 0" color="warning">
    {{ icons.mdiExclamation }}
  </v-icon>
</template>
<script setup>
import { mdiExclamation } from "@mdi/js";
import { Shift } from "@/models/ShiftModel";
import { useShiftValidation } from "@/composable/useShiftValidation";

const props = defineProps({
  shift: {
    type: Shift,
    required: true
  }
});

const icons = {
  mdiExclamation
};
const { alertMessages } = useShiftValidation(props.shift);
</script>
