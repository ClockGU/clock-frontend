<template>
  <v-select
    :value="value"
    :items="items"
    label="Type"
    item-text="text"
    item-value="value"
    return-object
    outlined
    @input="$emit('input', $event)"
  >
  </v-select>
</template>

<script>
export default {
  name: "ShiftFormSelect",
  props: {
    value: {
      type: Object,
      default: () => ({ text: "Shift", value: "st" })
    }
  },
  data: () => ({
    items: [
      { text: "Shift", value: "st" },
      { text: "Sick", value: "sk" },
      { text: "Vacation", value: "vn" }
    ]
  })
};
</script>
