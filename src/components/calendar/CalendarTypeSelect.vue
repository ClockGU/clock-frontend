<template>
  <v-menu location="bottom">
    <template #activator="{ props }">
      <v-btn variant="outlined" data-cy="calendar-type-select-button" v-bind="props">
        <span>{{ valueName }}</span>
        <v-icon end>{{ icons.mdiArrowDown }}</v-icon>
      </v-btn>
    </template>
    <v-list data-cy="calendar-type-select">
      <v-list-item
        v-for="type in types"
        :key="type.value"
        :data-cy="'calendar-type-select-' + type.value"
        @click="$emit('update:modelValue', type.value)"
      >
        <v-list-item-title>{{ type.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mdiArrowDown } from "@mdi/js";

export default {
  name: "CalendarTypeSelect",
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
emits: ['update:modelValue'],
  data: () => ({
    icons: {
      mdiArrowDown
    }
  }),
  computed: {
    types() {
      return [
        { text: this.$t("calendar.day"), value: "day" },
        { text: this.$t("calendar.week"), value: "week" },
        { text: this.$t("calendar.month"), value: "month" },
        { text: this.$t("calendar.fourdays"), value: "4day" }
      ];
    },
    valueName() {
      return this.types.find((item) => item.value === this.modelValue).text;
    }
  }
};
</script>
