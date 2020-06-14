<template>
  <v-row align="end" class="pl-4">
    <v-icon>{{ icons.mdiBriefcaseOutline }}</v-icon>
    <v-radio-group v-model="radios" row hide-details dense>
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
import { mdiBriefcaseOutline } from "@mdi/js";
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
      mdiBriefcaseOutline
    },
    typeColors: SHIFT_TYPE_COLORS
  }),
  computed: {
    types() {
      return SHIFT_TYPES.map(type => {
        return {
          text: this.$t(`shifts.types.${type.value}`),
          value: type.value
        };
      });
    },
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
