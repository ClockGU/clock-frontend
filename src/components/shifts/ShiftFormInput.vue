<template>
  <v-textarea
    :value="value"
    label="Note"
    outlined
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: "ShiftFormInput",
  props: {
    value: {
      type: String,
      default: ""
    }
  }
};
</script>
