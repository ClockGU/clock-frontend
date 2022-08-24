<template>
  <v-row align="end" class="pl-3">
    <v-radio-group v-model="radios" row hide-details dense class="mt-0 pt-0">
      <template #prepend>
        <v-icon :color="typeColors[value.value]">
          {{ typeIcons[value.value] }}
        </v-icon>
      </template>
      <v-radio
        v-for="type in types"
        :key="type.value"
        class="ml-o"
        :disabled="disabled || (type.value === 'bh' && !disabled)"
        :label="type.text"
        :value="type.value"
        :color="typeColors[type.value]"
      >
        <template #label>
          <label
            :class="
              'v-label theme--light ' +
              (type.value === radios
                ? getRadioColor(typeColors[type.value])
                : '')
            "
            style="left: 0; right: auto; position: relative"
            >{{ type.text }}</label
          >
        </template>
      </v-radio>
    </v-radio-group>
  </v-row>
</template>

<script>
import { mdiBriefcaseOutline } from "@mdi/js";
import { SHIFT_TYPES } from "@/models/ShiftModel";
import { SHIFT_TYPE_COLORS, mdShortToClassString } from "@/utils/colors";
import { SHIFT_TYPE_ICONS } from "@/utils/misc";

export default {
  name: "ShiftFormType",
  props: {
    value: {
      type: Object,
      default: () => ({ text: "Shift", value: "st" })
    },
    disabled: {
      type: Boolean,
      default: false
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
      return this.typeIcons["sk"];
    }
  },
  methods: {
    getRadioColor(colorName) {
      return mdShortToClassString(colorName);
    }
  }
};
</script>

<style scoped>
.green-lighten-1 {
}
</style>
