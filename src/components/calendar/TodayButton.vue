<template>
  <v-btn
    outlined
    class="mr-4"
    data-cy="calendar-today"
    @click="$emit('update:model-value', new Date())"
  >
    {{ $t("calendar.today") }}
  </v-btn>
</template>

<script>
export default {
  name: "TodayButton",
  emits: ["update:model-value"]
};
</script>
