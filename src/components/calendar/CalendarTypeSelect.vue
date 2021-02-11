<template>
  <v-menu bottom right>
    <template #activator="{ on }">
      <v-btn outlined data-cy="calendar-type-select-button" v-on="on">
        <span>{{ valueName }}</span>
        <v-icon right>{{ icons.mdiArrowDown }}</v-icon>
      </v-btn>
    </template>
    <v-list data-cy="calendar-type-select">
      <v-list-item
        v-for="type in types"
        :key="type.value"
        :data-cy="'calendar-type-select-' + type.value"
        @click="$emit('input', type.value)"
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
    value: {
      type: String,
      required: true
    }
  },
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
      return this.types.find((item) => item.value === this.value).text;
    }
  }
};
</script>
