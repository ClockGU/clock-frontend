<template>
  <v-menu bottom right>
    <template v-slot:activator="{ on }">
      <v-btn outlined data-cy="calendar-type-select-button" v-on="on">
        <span>{{ valueName }}</span>
        <v-icon right>{{ icons.mdiArrowDown }}</v-icon>
      </v-btn>
    </template>
    <v-list data-cy="calendar-type-select">
      <v-list-item
        v-for="type in types"
        :key="type"
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

const CALENDAR_TYPES = {
  month: "Month",
  week: "Week",
  day: "Day",
  "4day": "4 Days"
};

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
    },
    types: [
      { text: "Day", value: "day" },
      { text: "Week", value: "week" },
      { text: "Month", value: "month" },
      { text: "4 Days", value: "4day" }
    ]
  }),
  computed: {
    valueName() {
      return CALENDAR_TYPES[this.value];
    }
  }
};
</script>
