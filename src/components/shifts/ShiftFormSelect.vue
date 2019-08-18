<template>
  <v-select
    :value="value"
    :items="items"
    item-text="text"
    item-value="value"
    return-object
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
      required: true
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
