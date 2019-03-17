<template>
  <v-textarea :value="value" v-on:input="$emit('input', $event)" />
</template>

<script>
export default {
  name: "ShiftFormInput",
  props: {
    value: {
      type: String
    }
  }
};
</script>
