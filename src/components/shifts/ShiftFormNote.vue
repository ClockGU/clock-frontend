<template>
  <v-textarea
    aria-label="Add a note about the shift"
    :model-value="modelValue"
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
    modelValue: {
      type: String,
      default: ""
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      icons: { mdiNoteOutline }
    };
  },
  methods: {
    update(event) {
      this.$emit("update:modelValue", event);
    }
  }
};
</script>
