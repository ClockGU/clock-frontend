<template>
  <v-row align="end" class="pl-3">
    <v-radio-group
      v-model="radios"
      row
      hide-details
      dense
      class="mt-0 pt-0"
      :prepend-icon="typeIcons[value.value]"
    >
      <v-radio
        v-for="type in types"
        :key="type.value"
        class="ml-0"
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
import { SHIFT_TYPE_ICONS } from "@/utils/misc";

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
    typeColors: SHIFT_TYPE_COLORS,
    typeIcons: SHIFT_TYPE_ICONS
  }),
  computed: {
    types() {
      return SHIFT_TYPES.map((type) => {
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
        const selected = this.types.find((type) => type.value === value);
        this.$emit("input", selected);
      }
    },
    icon() {
      console.log(this.value.value);
      return this.typeIcons["sk"];
    }
  }
};
</script>
