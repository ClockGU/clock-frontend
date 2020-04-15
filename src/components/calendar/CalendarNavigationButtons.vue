<template>
  <div>
    <v-btn
      outlined
      class="mr-4"
      data-cy="calendar-today"
      @click="$emit('today')"
    >
      Today
    </v-btn>
    <v-btn
      fab
      text
      small
      data-cy="calendar-previous-month"
      @click="$emit('prev')"
    >
      <v-icon small>{{ icons.mdiChevronLeft }}</v-icon>
    </v-btn>
    <v-btn fab text small data-cy="calendar-next-month" @click="$emit('next')">
      <v-icon small>{{ icons.mdiChevronRight }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";

export default {
  name: "CalendarNavigationButtons",
  data: () => ({
    icons: {
      mdiChevronLeft,
      mdiChevronRight
    }
  })
};
</script>
