<template>
  <span v-if="alertMessages.length > 0" class="visually-hidden">
    {{ $t("aria.shiftsTable.warnings", { count: alertMessages.length }) }}
  </span>
  <v-icon
    v-if="alertMessages.length > 0"
    color="warning"
    aria-hidden="true"
    style="transform: translate(-65%, -50%)"
  >
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
const { alertMessages } = useShiftValidation(() => props.shift);

</script>
