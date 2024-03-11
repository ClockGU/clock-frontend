<template>
  <v-row align="end" class="pl-3">
    <v-radio-group v-model="radios" inline hide-details class="mt-0 pt-0">
      <template #prepend>
        <v-icon
          :icon="typeIcons[modelValue]"
          :color="typeColors[modelValue]"
        ></v-icon>
      </template>
      <v-radio
        v-for="type in types"
        :key="type.value"
        :disabled="disabled"
        :label="type.text"
        :value="type.value"
        :color="typeColors[type.value]"
      >
        <template #label>
          <div
            :class="
              'theme--light ' +
              (type.value === radios
                ? getRadioColor(typeColors[type.value])
                : '')
            "
          >
            {{ type.text }}
          </div>
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
    modelValue: {
      type: String,
      default: "st"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      icons: {
        mdiBriefcaseOutline
      },
      typeColors: SHIFT_TYPE_COLORS,
      typeIcons: SHIFT_TYPE_ICONS,
      radios: this.modelValue
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
    modelValue(val) {
      this.radios = val;
    },
    radios(val) {
      this.$emit("update:modelValue", val);
    }
  },
  methods: {
    getRadioColor(colorName) {
      return mdShortToClassString(colorName);
    }
  }
};
</script>
