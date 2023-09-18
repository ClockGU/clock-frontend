<template>
  <v-row align="end" class="pl-3">
    <v-radio-group
      v-model="radios"
      row
      hide-details
      density="compact"
      class="mt-0 pt-0"
    >
      <template #prepend>
        <v-icon :color="typeColors[value]">
          {{ typeIcons[value] }}
        </v-icon>
      </template>
      <v-radio
        v-for="type in types"
        :key="type.value"
        class="ml-o"
        :disabled="disabled"
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
      type: String,
      default: "st"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      icons: {
        mdiBriefcaseOutline
      },
      typeColors: SHIFT_TYPE_COLORS,
      typeIcons: SHIFT_TYPE_ICONS,
      radios: this.value
    };
  },
  computed: {
    types() {
      return SHIFT_TYPES.map((type) => {
        return {
          text: this.$t(`shifts.types.${type.value}`),
          value: type.value
        };
      });
    },
    icon() {
      return this.typeIcons["sk"];
    }
  },
  watch: {
    value(val) {
      this.radios = val;
    },
    radios(val) {
      this.$emit("input", val);
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
