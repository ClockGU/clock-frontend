<template>
  <v-row align="center">
    <v-icon class="ml-4 mr-2">{{ icons.mdiInformationOutline }}</v-icon>
    <v-radio-group v-model="radios" row>
      <v-radio
        v-for="type in types"
        :key="type.value"
        :label="type.text"
        :value="type.value"
        :color="typeColors[type.value]"
      ></v-radio>
    </v-radio-group>
  </v-row>
</template>

<script>
import { mdiInformationOutline } from "@mdi/js";
import { SHIFT_TYPES } from "@/models/ShiftModel";
import { SHIFT_TYPE_COLORS } from "@/utils/colors";

export default {
  name: "ShiftFormType",
  props: {
    value: {
      type: Object,
      default: () => ({ text: "Shift", value: "st" })
    }
  },
  data: () => ({
    icons: {
      mdiInformationOutline
    },
    types: SHIFT_TYPES,
    typeColors: SHIFT_TYPE_COLORS
  }),
  computed: {
    radios: {
      get() {
        return this.value.value;
      },
      set(value) {
        const selected = this.types.find(type => type.value === value);
        this.$emit("input", selected);
      }
    }
  }
};
</script>
