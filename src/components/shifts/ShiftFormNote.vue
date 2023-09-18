<template>
  <v-textarea
    :model-value="value"
    :label="$t('shifts.note.label')"
    variant="filled"
    :prepend-icon="icons.mdiNoteOutline"
    @update:model-value="update($event)"
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
  data() {
    return {
      icons: { mdiNoteOutline }
    };
  },
  methods: {
    update(event) {
      this.$emit("input", event);
    }
  }
};
</script>
