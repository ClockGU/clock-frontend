<template>
  <v-textarea
    :value="value"
    label="Note"
    filled
    :prepend-icon="icons.mdiNoteOutline"
    @input="$emit('input', $event)"
  />
</template>

<script>
import { mdiNoteOutline } from "@mdi/js";

export default {
  name: "ShiftFormInput",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    icons: { mdiNoteOutline }
  })
};
</script>
