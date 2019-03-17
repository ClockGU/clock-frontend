<template>
  <v-select v-model="select" :items="items" item-text="text" item-value="value">
  </v-select>
</template>

<script>
export default {
  name: "ShiftFormSelect",
  props: {
    shift: {
      type: Object
    }
  },
  data: () => ({
    select: { text: "Shift", value: "st" },
    items: [
      { text: "Shift", value: "st" },
      { text: "Sick", value: "sk" },
      { text: "Vacation", value: "vn" }
    ]
  }),
  watch: {
    select: function(value) {
      this.shift.type = value;
    }
  }
};
</script>
