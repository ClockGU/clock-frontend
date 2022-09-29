<template>
  <v-textarea
    :value="value"
    :label="$t('shifts.note.label')"
    filled
    :prepend-icon="icons.mdiNoteOutline"
    @input="update($event)"
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
  }),
  methods: {
    update(event) {
      this.$emit("input", event);
    }
  }
};
</script>
