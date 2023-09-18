<template>
  <div>
    <v-btn
      variant="outlined"
      class="mr-4"
      data-cy="calendar-today"
      @click="$emit('today')"
    >
      {{ $t("calendar.today") }}
    </v-btn>
    <v-btn
      fab
      variant="text"
      size="small"
      data-cy="calendar-previous-month"
      @click="$emit('prev')"
    >
      <v-icon size="small">{{ icons.mdiChevronLeft }}</v-icon>
    </v-btn>
    <v-btn
      fab
      variant="text"
      size="small"
      data-cy="calendar-next-month"
      @click="$emit('next')"
    >
      <v-icon size="small">{{ icons.mdiChevronRight }}</v-icon>
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
