<template>
  <v-select
    v-model="select"
    :items="items"
    item-text="text"
    item-value="value"
    @input="$emit('input', $event)"
    return-object
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
    select: { text: "Shift", value: "st" },
    items: [
      { text: "Shift", value: "st" },
      { text: "Sick", value: "sk" },
      { text: "Vacation", value: "vn" }
    ]
  })
};
</script>
