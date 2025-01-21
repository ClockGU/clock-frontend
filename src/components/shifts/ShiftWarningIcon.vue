<template>
  <v-icon v-if="alertMessages.length > 0" color="warning">
    {{ icons.mdiExclamation }}
  </v-icon>
</template>

<script>
import ShiftValidationMixin from "@/mixins/ShiftValidationMixin";
import { mdiExclamation } from "@mdi/js";
import { Shift } from "@/models/ShiftModel";

export default {
  name: "ShiftWarning",
  mixins: [ShiftValidationMixin],
  props: {
    shift: {
      type: Shift,
      required: true,
      default: undefined
    }
  },
  data() {
    return {
      icons: {
        mdiExclamation
      }
    };
  }
};
</script>
